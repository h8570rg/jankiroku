import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "~/lib/database.types";
import { dayjs } from "~/lib/utils/date";
import { CalcMethod } from "../utils/schemas";

export type Rule = {
  playersCount: number;
  defaultPoints: number;
  defaultCalcPoints: number;
  rate: number;
  chipRate: number;
  crackBoxBonus: number;
  calcMethod: CalcMethod;
  incline: {
    incline1: number;
    incline2: number;
    incline3: number;
    incline4: number;
  };
};

export type Match = {
  id: string;
  date: string;
  players: {
    id: string;
    name: string;
    janrecoId: string;
  }[];
  rule: Rule;
};

export type MatchPlayerAddPayload = {
  matchId: string;
  profileId: string;
};

export function matchService(supabaseClient: SupabaseClient<Database>) {
  return {
    getMatch: async ({ matchId }: { matchId: string }): Promise<Match> => {
      const { data, error } = await supabaseClient
        .from("matches")
        .select(
          `
          id, created_at,
          profiles!matches_profiles(id, name, janreco_id),
          rules (*)
        `,
        )
        .eq("id", matchId)
        .order("updated_at", { foreignTable: "rules", ascending: true })
        .single();
      if (error) {
        throw error;
      }

      const rule = data.rules[0];
      const incline = rule.incline.split("_").map((incline) => Number(incline));
      const [incline1, incline2, incline3, incline4] = incline;

      return {
        id: data.id,
        date: dayjs(data.created_at).format("YYYY / M / D"),
        players: data.profiles.map((profile) => ({
          id: profile.id,
          name: profile.name as string,
          janrecoId: profile.janreco_id as string,
        })),
        rule: {
          playersCount: rule.players_count,
          defaultPoints: rule.default_points,
          defaultCalcPoints: rule.default_calc_points,
          rate: rule.rate,
          chipRate: rule.chip_rate,
          crackBoxBonus: rule.crack_box_bonus,
          calcMethod: rule.calc_method as CalcMethod,
          incline: {
            incline1,
            incline2,
            incline3,
            incline4,
          },
        },
      };
    },

    addMatchPlayer: async ({
      matchId,
      profileId,
    }: MatchPlayerAddPayload): Promise<void> => {
      const { error } = await supabaseClient
        .from("matches_profiles")
        .insert([{ match_id: matchId, profile_id: profileId }]);
      if (error) {
        throw error;
      }
    },
  };
}
