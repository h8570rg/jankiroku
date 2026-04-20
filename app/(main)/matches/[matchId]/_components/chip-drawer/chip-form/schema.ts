import { coerceFormValue } from "@conform-to/zod/v4/future";
import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const addChipSchema = coerceFormValue(
  z
    .object({
      playerChip: z.array(
        z.object({
          profileId: schema.profileId,
          chipCount: z.string("チップ枚数を入力してください").transform(Number),
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
          message: `チップの合計が0枚になるように入力してください\n現在: ${total.toLocaleString()}枚`,
          path: ["playerChip"],
        });
      }
    }),
);
