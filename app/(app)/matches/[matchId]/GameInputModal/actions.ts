"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { Rule } from "~/lib/services/match";
import { serverServices } from "~/lib/services/server";
import { schemas } from "~/lib/utils/schemas";

type AddGameState = {
  success?: boolean;
  errors?: {
    base?: string[];
    playerPoints?: string[];
    crackBoxPlayerId?: string[];
  };
};

const addGameSchema = z
  .object({
    playerPoints: z.array(
      z.object({
        profileId: schemas.profileId,
        points: schemas.points,
      }),
    ),
    playersCount: z.number(),
    defaultPoints: z.number(),
    crackBoxPlayerId: schemas.profileId.transform((v) =>
      v === "" ? undefined : v,
    ),
  })
  .refine(
    ({ playerPoints, playersCount }) => {
      return (
        playerPoints.filter(({ points }) => points !== undefined).length ===
        playersCount
      );
    },
    ({ playersCount }) => ({
      path: ["playerPoints"],
      message: `${playersCount}人分の点数を入力してください`,
    }),
  )
  .refine(
    ({ playerPoints, playersCount, defaultPoints }) => {
      const total = playerPoints.reduce((acc, { points }) => {
        return acc + (points ?? 0);
      }, 0);
      return total === playersCount * defaultPoints;
    },
    ({ playerPoints, playersCount, defaultPoints }) => {
      const total = playerPoints.reduce((acc, { points }) => {
        return acc + (points ?? 0);
      }, 0);
      return {
        path: ["playerPoints"],
        message: `点数の合計が${(
          playersCount * defaultPoints
        ).toLocaleString()}点になるように入力してください\n現在: ${total.toLocaleString()}点`,
      };
    },
  )
  .refine(
    ({ playerPoints, crackBoxPlayerId }) => {
      const underZeroPointsPlayerExists = playerPoints.some(
        ({ points }) => typeof points === "number" && points < 0,
      );
      if (!underZeroPointsPlayerExists && crackBoxPlayerId !== undefined) {
        return false;
      }
      return true;
    },
    {
      path: ["crackBoxPlayerId"],
      message: "0点を下回るプレイヤーがいません",
    },
  );

export type AddGameInputSchema = z.input<typeof addGameSchema>;

export async function addGame(
  matchId: string,
  rule: Rule,
  totalPlayersCount: number,
  prevState: AddGameState,
  formData: FormData,
): Promise<AddGameState> {
  const playerPoints = Array.from({ length: totalPlayersCount }).map((_, i) => {
    return {
      profileId: formData.get(`playerPoints.${i}.profileId`),
      points: formData.get(`playerPoints.${i}.points`),
    };
  });

  const validatedFields = addGameSchema.safeParse({
    playerPoints,
    playersCount: rule.playersCount,
    defaultPoints: rule.defaultPoints,
    crackBoxPlayerId: formData.get("crackBoxPlayerId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { createGame } = serverServices();

  await createGame({
    matchId,
    playerPoints: validatedFields.data.playerPoints
      .filter((playerPoints) => playerPoints.points !== undefined)
      .map((playerPoint) => {
        return {
          profileId: playerPoint.profileId,
          points: playerPoint.points as number,
        };
      }),
    rule,
    crackBoxPlayerId: validatedFields.data.crackBoxPlayerId,
  });

  revalidateTag(`match-${matchId}`);

  return {
    success: true,
  };
}
