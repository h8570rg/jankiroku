import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const createMatchSchema = z
  .object({
    playersCount: schema.playersCount,
    incline: schema.incline,
    customIncline: z.optional(schema.customIncline),
    rate: schema.rate,
    chipRate: schema.chipRate,
    crackBoxBonus: schema.crackBoxBonus,
    defaultPoints: schema.defaultPoints,
    defaultCalcPoints: schema.defaultCalcPoints,
    calcMethod: schema.calcMethod,
  })
  .superRefine(({ incline, customIncline }, ctx) => {
    if (incline === "custom" && customIncline === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "カスタムウマの値を入力してください",
        path: ["customIncline"],
      });
    }
  });

export type CreateMatchInput = z.input<typeof createMatchSchema>;
