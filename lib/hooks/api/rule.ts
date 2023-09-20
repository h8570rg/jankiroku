import useSWRMutation from "swr/mutation";
import { z } from "zod";

import { RuleCreatePayload } from "~/lib/services/rules";
import { post } from "~/lib/utils/request";
import { schemas } from "~/lib/utils/schemas";

export const useRuleCreate = () => {
  return useSWRMutation(
    "/api/rules",
    async (
      url,
      {
        arg: {
          calcMethod,
          chipRate,
          crackBoxBonus,
          defaultCalcPoints,
          defaultPoints,
          matchId,
          playersCount,
          rate,
          incline: { incline1, incline2, incline3, incline4 },
        },
      }: { arg: RuleCreateSchema },
    ) => {
      const incline = `${incline1}_${incline2}_${incline3}_${incline4}`;
      const payload: RuleCreatePayload = {
        calcMethod,
        chipRate,
        crackBoxBonus,
        defaultCalcPoints,
        defaultPoints,
        matchId,
        playersCount,
        rate,
        incline,
      };
      await post(url, payload);
    },
  );
};

export const ruleCreateSchema = z.object({
  calcMethod: schemas.calcMethod,
  chipRate: schemas.chipRate,
  crackBoxBonus: schemas.crackBoxBonus,
  defaultCalcPoints: schemas.defaultCalcPoints,
  defaultPoints: schemas.defaultPoints,
  matchId: schemas.matchId,
  playersCount: schemas.playersCount,
  rate: schemas.rate,
  incline: schemas.incline,
});
export type RuleCreateSchema = z.infer<typeof ruleCreateSchema>;
