"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { serverServices } from "@/lib/services/server";
import type { Rule } from "@/lib/type";
import { schema } from "@/lib/utils/schema";
import { calcPlayerScores } from "@/lib/utils/score";

function ensurePlayersArray(
  payload: Record<string, unknown>,
): { id: string; points: string }[] {
  const raw = payload.players;
  if (Array.isArray(raw)) {
    return raw.map((item) => ({
      id: String((item as Record<string, unknown>)?.id ?? ""),
      points: String((item as Record<string, unknown>)?.points ?? ""),
    }));
  }
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return Object.keys(raw)
      .sort((a, b) => Number(a) - Number(b))
      .map((i) => {
        const item = (raw as Record<string, unknown>)[i] as Record<
          string,
          unknown
        >;
        return {
          id: String(item?.id ?? ""),
          points: String(item?.points ?? ""),
        };
      });
  }
  return [];
}

const addGameSchema = z
  .object({
    players: z.array(
      z.object({
        id: schema.profileId,
        points: schema.points,
      }),
    ),
    playersCount: z.number(),
    defaultPoints: z.number(),
    crackBoxPlayerId: schema.profileId.transform((v) =>
      v === "" ? undefined : v,
    ),
  })
  .superRefine(({ players, playersCount }, ctx) => {
    const filledCount = players.filter(
      ({ points }) => points !== undefined,
    ).length;
    if (filledCount !== playersCount) {
      ctx.addIssue({
        code: "custom",
        message: `${playersCount}人分の点数を入力してください`,
        path: ["players"],
      });
    }
  })
  .superRefine(({ players, playersCount, defaultPoints }, ctx) => {
    const total = players.reduce((acc, { points }) => {
      return acc + (points ?? 0);
    }, 0);
    const expected = playersCount * defaultPoints;
    if (total !== expected) {
      ctx.addIssue({
        code: "custom",
        message: `点数の合計が${expected.toLocaleString()}点になるように入力してください\n現在: ${total.toLocaleString()}点`,
        path: ["players"],
      });
    }
  })
  .superRefine(({ players, crackBoxPlayerId }, ctx) => {
    const underZeroPointsPlayerExists = players.some(
      ({ points }) => typeof points === "number" && points < 0,
    );
    if (!underZeroPointsPlayerExists && crackBoxPlayerId !== undefined) {
      ctx.addIssue({
        code: "custom",
        message: "0点を下回るプレイヤーがいません",
        path: ["crackBoxPlayerId"],
      });
    }
  });

export async function addGame(
  matchId: string,
  rule: Rule,
  _totalPlayersCount: number,
  _prevState: unknown,
  formData: FormData,
) {
  const submission = parseSubmission(formData);
  const players = ensurePlayersArray(submission.payload);

  const validatedFields = addGameSchema.safeParse({
    players,
    playersCount: rule.playersCount,
    defaultPoints: rule.defaultPoints,
    crackBoxPlayerId: submission.payload.crackBoxPlayerId,
  });

  if (!validatedFields.success) {
    return report(submission, {
      error: { issues: validatedFields.error.issues },
    });
  }

  const { createGame } = await serverServices();

  const playerScores = calcPlayerScores({
    players: validatedFields.data.players.filter(
      (p) => p.points !== undefined,
    ) as { id: string; points: number }[],
    rule,
    crackBoxPlayerId: validatedFields.data.crackBoxPlayerId,
  });

  await createGame({
    matchId,
    gamePlayers: playerScores,
  });

  revalidatePath(`/matches/${matchId}`);

  return report(submission, {});
}
