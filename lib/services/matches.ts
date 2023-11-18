import "server-only";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "~/lib/database.types";
import { dayjs } from "~/lib/utils/date";

export type CreateMatchPayload = {
  calcMethod: string;
  chipRate: number;
  crackBoxBonus: number;
  defaultCalcPoints: number;
  defaultPoints: number;
  playersCount: number;
  rate: number;
  incline: {
    incline1: number;
    incline2: number;
    incline3: number;
    incline4: number;
  };
};

export type Matches = {
  id: string;
  date: string;
}[];

export function matchesService(supabaseClient: SupabaseClient<Database>) {
  return {
    createMatch: async ({
      calcMethod,
      chipRate,
      crackBoxBonus,
      defaultCalcPoints,
      defaultPoints,
      playersCount,
      rate,
      incline: { incline1, incline2, incline3, incline4 },
    }: CreateMatchPayload) => {
      const createMatchResult = await supabaseClient
        .from("matches")
        .insert({})
        .select()
        .single();
      if (createMatchResult.error) {
        throw createMatchResult.error;
      }
      const incline = `${incline1}_${incline2}_${incline3}_${incline4}`;
      const createRulePromise = supabaseClient.from("rules").insert({
        calc_method: calcMethod,
        chip_rate: chipRate,
        crack_box_bonus: crackBoxBonus,
        default_calc_points: defaultCalcPoints,
        default_points: defaultPoints,
        match_id: createMatchResult.data.id,
        players_count: playersCount,
        rate,
        incline,
      });
      const createMatchesUsersPromise = supabaseClient
        .from("matches_profiles")
        .insert({ match_id: createMatchResult.data.id });
      const [createRuleResult, createMatchesUsersResult] = await Promise.all([
        createRulePromise,
        createMatchesUsersPromise,
      ]);
      if (createRuleResult.error) {
        throw createRuleResult.error;
      }
      if (createMatchesUsersResult.error) {
        throw createMatchesUsersResult.error;
      }
      return {
        id: createMatchResult.data.id, // TODO: modelを使ってMatch型を返す。MatchesもMatchの配列にする。
      };
    },

    /**
     * @see https://supabase.com/docs/guides/api/joins-and-nesting
     */
    getMatches: async (
      { page }: { page: number } = { page: 1 },
    ): Promise<Matches> => {
      const matchLimit = 99;
      const rangeFrom = (page - 1) * matchLimit;
      const rangeTo = page * matchLimit - 1;
      const userResult = await supabaseClient.auth.getUser(); // TODO: function化して高速化
      if (userResult.error) {
        throw userResult.error;
      }
      // TODO: 見直す

      const { data, error } = await supabaseClient
        .from("matches")
        .select(
          `
      *,
      rules (
        *
      ),
      matches_profiles!inner (*),
      profiles!matches_profiles (
        *
      )
      `,
        )
        .filter("matches_profiles.profile_id", "eq", userResult.data?.user.id)
        .range(rangeFrom, rangeTo);
      if (error) {
        throw error;
      }

      return data.map((match) => {
        return {
          id: match.id,
          date: dayjs(match.created_at).format("YYYY / M / D"),
        };
      });
    },
  };
}
