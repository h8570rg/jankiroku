import { z } from "zod";
import { schema } from "@/lib/utils/schema";

/** フォーム用スキーマ（playersCount/defaultPointsはアクションで検証） */
export const addGameFormSchema = z.object({
  players: z.array(
    z.object({
      id: schema.profileId,
      points: schema.points,
      name: schema.name,
    }),
  ),
  crackBoxPlayerId: schema.profileId.transform((v) =>
    v === "" ? undefined : v,
  ),
});

export type AddGameFormInput = z.input<typeof addGameFormSchema>;
