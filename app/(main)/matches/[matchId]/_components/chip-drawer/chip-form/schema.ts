import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const addChipSchema = z
  .object({
    playerChip: z.array(
      z.object({
        profileId: schema.profileId,
        chipCount: z.string().transform(Number),
      }),
    ),
  })
  .superRefine(({ playerChip }, ctx) => {
    const total = playerChip.reduce((acc, { chipCount }) => {
      return acc + (chipCount ?? 0);
    }, 0);
    if (total !== 0) {
      ctx.addIssue({
        code: "custom",
        message: `チップの合計が0枚なるように入力してください\n現在: ${total.toLocaleString()}枚`,
        path: ["playerChip"],
      });
    }
  });
