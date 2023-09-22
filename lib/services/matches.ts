import "server-only";

import { dayjs } from "~/lib/utils/date";
import { createSupabaseClient } from "~/lib/utils/supabase/routeHandlerClient";

export type CreateMatchPaylead = {
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

export async function createMatch({
  calcMethod,
  chipRate,
  crackBoxBonus,
  defaultCalcPoints,
  defaultPoints,
  playersCount,
  rate,
  incline: { incline1, incline2, incline3, incline4 },
}: CreateMatchPaylead) {
  const createMatchResult = await createSupabaseClient()
    .from("matches")
    .insert({})
    .select();
  if (createMatchResult.error) {
    throw createMatchResult.error;
  }
  const match = createMatchResult.data[0];
  const incline = `${incline1}_${incline2}_${incline3}_${incline4}`;
  const createRulePromise = createSupabaseClient().from("rules").insert({
    calc_method: calcMethod,
    chip_rate: chipRate,
    crack_box_bonus: crackBoxBonus,
    default_calc_points: defaultCalcPoints,
    default_points: defaultPoints,
    match_id: match.id,
    players_count: playersCount,
    rate,
    incline,
  });
  const createMatchesUsersPromise = createSupabaseClient()
    .from("matches_profiles")
    .insert({ match_id: match.id });
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
  return;
}

export type Matches = {
  id: string;
  date: string;
}[];

/**
 * @see https://supabase.com/docs/guides/api/joins-and-nesting
 */
export async function getMatches(): Promise<Matches> {
  const { data, error } = await createSupabaseClient().from("matches").select(`
    *,
    rules (
      *
    ),
    profiles!matches_profiles (
      *
    )
    `);
  if (error) {
    throw error;
  }
  return data.map((match) => {
    return {
      id: match.id,
      date: dayjs(match.created_at).format("YYYY / M / D"),
    };
  });
}
