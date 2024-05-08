import { Supabase } from ".";

export type Matches = {
  id: string;
  date: string;
}[];

export function matchesService(supabase: Supabase) {
  return {
    createMatch: async ({
      calcMethod,
      chipRate,
      crackBoxBonus,
      defaultCalcPoints,
      defaultPoints,
      playersCount,
      rate,
      incline,
    }: {
      calcMethod: string;
      chipRate: number;
      crackBoxBonus: number;
      defaultCalcPoints: number;
      defaultPoints: number;
      playersCount: number;
      rate: number;
      incline: string;
    }) => {
      const createMatchResult = await supabase
        .from("matches")
        .insert({})
        .select()
        .single();
      if (createMatchResult.error) {
        throw createMatchResult.error;
      }
      const createRulePromise = supabase.from("rules").insert({
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
      const createMatchesUsersPromise = supabase
        .from("match_players")
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
      const userResult = await supabase.auth.getUser(); // TODO: function化して高速化
      if (userResult.error) {
        throw userResult.error;
      }

      const { data, error } = await supabase
        .from("matches")
        .select("*, match_players!inner(*)")
        .eq("match_players.player_id", userResult.data?.user.id)
        .range(rangeFrom, rangeTo)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data.map((match) => {
        return {
          id: match.id,
          date: match.created_at,
        };
      });
    },
  };
}