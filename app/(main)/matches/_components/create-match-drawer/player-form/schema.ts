import { z } from "zod";

const playerIds = z
  .array(z.string())
  .min(1, "プレイヤーを1人以上選択してください");

export const playerStepSchema = z.object({ playerIds });
