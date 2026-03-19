import { z } from "zod";
import { schema } from "@/lib/utils/schema";

const commonFields = {
  rate: schema.rate,
  chipRate: schema.chipRate,
  crackBoxBonus: schema.crackBoxBonus,
  defaultPoints: schema.defaultPoints,
  defaultCalcPoints: schema.defaultCalcPoints,
  calcMethod: schema.calcMethod,
};

export const createMatchSchema = z.discriminatedUnion("playersCount", [
  z.object({
    playersCount: z.literal("4").transform(() => 4),
    incline: schema.inclineFor4Players,
    ...commonFields,
  }),
  z.object({
    playersCount: z.literal("3").transform(() => 3),
    incline: schema.inclineFor3Players,
    ...commonFields,
  }),
]);
export type CreateMatchInput = z.input<typeof createMatchSchema>;
