import { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { Database } from "~/lib/database.types";
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

export function matchService(supabaseClient: SupabaseClient<Database>) {
  return {
    getMatch: ({ matchId }: { matchId: string }) =>
      unstable_cache(
        async (): Promise<Match> => {
          const { data, error } = await supabaseClient
            .from("matches")
            .select("*, profiles!match_players(*), rules(*)")
            .eq("id", matchId)
            .order("created_at", { ascending: true })
            .single();

          if (error) throw error;

          // TODO: ruleは別で取得で良さそう、複数ある場合もあり得るし。incline変換とかも関数化する
          const rule = data.rules[0];
          const incline = rule.incline
            .split("_")
            .map((incline) => Number(incline));
          const [incline1, incline2, incline3, incline4] = incline;

          return {
            id: data.id,
            date: data.created_at,
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
        [`match-${matchId}`],
        {
          tags: [`match-${matchId}`],
        },
      )(),

    addMatchPlayer: async ({
      matchId,
      profileId,
    }: {
      matchId: string;
      profileId: string;
    }) => {
      const { error } = await supabaseClient.from("match_players").insert({
        match_id: matchId,
        player_id: profileId,
      });
      if (error) throw error; // TODO: throwを共通化する？

      return;
    },

    // TODO: updateでは。個別updateにしてそれをactionでまとめて呼ぶべき
    addMatchChip: async ({
      matchId,
      playerChips,
    }: {
      matchId: string;
      playerChips: {
        profileId: string;
        chipCount: number;
      }[];
    }) =>
      unstable_cache(
        async () => {
          await Promise.all(
            playerChips.map(async (playerChip) => {
              const { error } = await supabaseClient
                .from("match_players")
                .update({
                  match_id: matchId,
                  player_id: playerChip.profileId,
                  chip_count: playerChip.chipCount,
                })
                .eq("match_id", matchId)
                .eq("profile_id", playerChip.profileId);
              if (error) {
                throw error;
              }
            }),
          );

          return;
        },
        [`match-${matchId}-chip`],
        {
          tags: [`match-${matchId}-chip`],
        },
      )(),

    getMatchChips: async ({ matchId }: { matchId: string }) =>
      unstable_cache(
        async () => {
          const { data, error } = await supabaseClient
            .from("match_players")
            .select("*")
            .eq("match_id", matchId);
          if (error) throw error;

          return data.map((matchPlayer) => ({
            profileId: matchPlayer.player_id,
            chip: matchPlayer.chip_count,
          }));
        },
        [`match-${matchId}-chip`],
        {
          tags: [`match-${matchId}-chip`],
        },
      )(),
  };
}
