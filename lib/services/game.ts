import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "~/lib/database.types";
import { calcPlayerScores } from "../utils/score";
import { Rule } from "./match";

export type GameCreatePayload = {
  playerPoints: {
    profileId: string;
    points: number;
  }[];
  matchId: string;
  rule: Rule;
  crackBoxPlayerId?: string;
};

export function gameService(supabaseClient: SupabaseClient<Database>) {
  return {
    createGame: async ({
      playerPoints,
      matchId,
      rule,
      crackBoxPlayerId,
    }: GameCreatePayload) => {
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
      playerScores.forEach(async (playerScore) => {
        const { error } = await supabaseClient.from("scores").insert({
          game_id: gameId,
          profile_id: playerScore.profileId,
          score: playerScore.score,
        });
        if (error) {
          throw error;
        }
      });
    },
  };
}
