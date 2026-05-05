"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { serverServices } from "@/lib/services/server";
import type { Rule } from "@/lib/type";
import { calcPlayerScores } from "@/lib/utils/score";
import { createCreateGameSchema } from "./schema";

export async function createGame(
  matchId: string,
  rule: Rule,
  _prevState: unknown,
  formData: FormData,
) {
  const submission = parseSubmission(formData);

  const validatedFields = createCreateGameSchema({
    playersCount: rule.playersCount,
    defaultPoints: rule.defaultPoints,
  }).safeParse({
    players: submission.payload.players,
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

  return report(submission, { reset: true });
}
