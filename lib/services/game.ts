import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "~/lib/database.types";
import { calcPlayerScores } from "../utils/score";
import { Rule } from "./match";

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
      rule: Rule;
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

    // TODO: profileIdとplayerIdの違いを整理
    getGames: async ({ matchId }: { matchId: string }) => {
      const { data, error } = await supabaseClient
        .from("games")
        .select("*, game_players(*)")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data.map((game) => ({
        id: game.id,
        scores: game.game_players.map((gamePlayer) => ({
          profileId: gamePlayer.player_id,
          score: gamePlayer.score,
        })),
      }));
    },
  };
}
