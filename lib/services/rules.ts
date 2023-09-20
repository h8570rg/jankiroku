import "server-only";

import { repositories } from "~/lib/repositories";

export type RuleCreatePayload = {
  calcMethod: string;
  chipRate: number;
  crackBoxBonus: number;
  defaultCalcPoints: number;
  defaultPoints: number;
  matchId: string;
  playersCount: number;
  rate: number;
  incline: string;
};

export const rules = {
  create: async ({
    calcMethod,
    chipRate,
    crackBoxBonus,
    defaultCalcPoints,
    defaultPoints,
    matchId,
    playersCount,
    rate,
    incline,
  }: RuleCreatePayload) => {
    const { data, error } = await repositories
      .rules()
      .insert({
        calc_method: calcMethod,
        chip_rate: chipRate,
        crack_box_bonus: crackBoxBonus,
        default_calc_points: defaultCalcPoints,
        default_points: defaultPoints,
        match_id: matchId,
        players_count: playersCount,
        rate,
        incline,
      })
      .select();
    if (error) {
      throw error;
    }
    return data;
  },
};
