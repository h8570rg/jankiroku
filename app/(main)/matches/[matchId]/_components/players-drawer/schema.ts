import { z } from "zod";

export const updatePlayersSchema = z.object({
  playerIds: z.array(z.string()).min(1, "プレイヤーを1人以上選択してください"),
});
