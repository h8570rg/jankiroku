import { coerceFormValue } from "@conform-to/zod/v4/future";
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

const fourPlayerFields = {
  playersCount: z.literal("4").transform(() => 4 as const),
  incline: schema.inclineFor4Players,
  ...commonFields,
};

const threePlayerFields = {
  playersCount: z.literal("3").transform(() => 3 as const),
  incline: schema.inclineFor3Players,
  ...commonFields,
};

export const ruleSchema = coerceFormValue(
  z.discriminatedUnion("playersCount", [
    z.object(fourPlayerFields),
    z.object(threePlayerFields),
  ]),
);

export type RuleInput = z.input<typeof ruleSchema>;
export type RuleOutput = z.output<typeof ruleSchema>;

export const playersCount4DefaultValues = {
  playersCount: "4",
  incline: { presets: "0_0_0_0" },
  crackBoxBonus: "10000",
  defaultPoints: "25000",
  defaultCalcPoints: "30000",
  calcMethod: "round",
  rate: "0",
  chipRate: { preset: "0" },
} satisfies RuleInput;

export const playersCount3DefaultValues = {
  playersCount: "3",
  incline: { presets: "0_0_0_0" },
  crackBoxBonus: "10000",
  defaultPoints: "35000",
  defaultCalcPoints: "40000",
  calcMethod: "round",
  rate: "0",
  chipRate: { preset: "0" },
} satisfies RuleInput;
