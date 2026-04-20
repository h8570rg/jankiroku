import { coerceFormValue } from "@conform-to/zod/v4/future";
import { z } from "zod";

export const createPlayerStepSchema = (playersCount: number) =>
  coerceFormValue(
    z.object({
      playerIds: z
        .array(z.string())
        .min(playersCount, `プレイヤーを${playersCount}人以上選択してください`),
    }),
  );
