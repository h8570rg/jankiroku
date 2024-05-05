import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "~/lib/database.types";
import { CalcMethod } from "../utils/schemas";
import { calcPlayerScores } from "../utils/score";

export function gameService(supabaseClient: SupabaseClient<Database>) {
  return {
    createGame: async ({
      playerPoints,
      matchId,
      rule,
      crackBoxPlayerId,
    }: {
      playerPoints: {
        profileId: string;
        points: number;
      }[];
      matchId: string;
      rule: {
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
      crackBoxPlayerId?: string;
    }) => {
      const playerScores = calcPlayerScores({
        playerPoints,
        rule,
        crackBoxPlayerId,
      });
      const createGameResult = await supabaseClient
        .from("games")
        .insert({
          match_id: matchId,
        })
        .select()
        .single();
      if (createGameResult.error) {
        throw createGameResult.error;
      }
      const gameId = createGameResult.data.id;
      await Promise.all(
        playerScores.map(async (playerScore) => {
          const { error } = await supabaseClient.from("game_players").insert({
            game_id: gameId,
            player_id: playerScore.profileId,
            score: playerScore.score,
          });
          if (error) throw error;
        }),
      );
      return;
    },
  };
}
