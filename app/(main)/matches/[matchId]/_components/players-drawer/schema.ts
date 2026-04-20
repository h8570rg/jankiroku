import { coerceFormValue } from "@conform-to/zod/v4/future";
import { z } from "zod";

export const updatePlayersSchema = coerceFormValue(
  z.object({
    playerIds: z
      .array(z.string())
      .min(1, "プレイヤーを1人以上選択してください"),
  }),
);
