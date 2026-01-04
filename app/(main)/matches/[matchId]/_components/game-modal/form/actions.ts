"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { serverServices } from "@/lib/services/server";
import type { Rule } from "@/lib/type";
import { schema } from "@/lib/utils/schema";
import { calcPlayerScores } from "@/lib/utils/score";

type AddGameState = {
  success?: boolean;
  errors?: {
    base?: string[];
    players?: string[];
    crackBoxPlayerId?: string[];
  };
};

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

export type AddGameInputSchema = z.input<typeof addGameSchema>;

export async function addGame(
  matchId: string,
  rule: Rule,
  totalPlayersCount: number,
  _prevState: AddGameState,
  formData: FormData,
): Promise<AddGameState> {
  const players = Array.from({ length: totalPlayersCount }).map((_, i) => {
    return {
      id: formData.get(`players.${i}.id`),
      points: formData.get(`players.${i}.points`),
    };
  });

  const validatedFields = addGameSchema.safeParse({
    players,
    playersCount: rule.playersCount,
    defaultPoints: rule.defaultPoints,
    crackBoxPlayerId: formData.get("crackBoxPlayerId"),
  });

  if (!validatedFields.success) {
    const flattened = z.flattenError(validatedFields.error);
    return {
      errors: flattened.fieldErrors,
    };
  }

  const { createGame } = await serverServices();

  const playerScores = calcPlayerScores({
    players: validatedFields.data.players.filter(
      (players) => players.points !== undefined,
    ) as { id: string; points: number }[],
    rule,
    crackBoxPlayerId: validatedFields.data.crackBoxPlayerId,
  });

  await createGame({
    matchId,
    gamePlayers: playerScores,
  });

  revalidatePath(`/matches/${matchId}`);

  return {
    success: true,
  };
}
