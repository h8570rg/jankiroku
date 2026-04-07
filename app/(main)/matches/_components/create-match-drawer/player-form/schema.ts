import { z } from "zod";

export const createPlayerStepSchema = (playersCount: number) =>
  z.object({
    playerIds: z
      .array(z.string())
      .min(playersCount, `プレイヤーを${playersCount}人以上選択してください`),
  });
