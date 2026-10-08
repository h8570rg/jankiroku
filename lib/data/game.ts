import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { GamePlayer } from "@/lib/type";
import { getUser } from "./user";

export async function createGame({
  matchId,
  gamePlayers,
}: {
  gamePlayers: GamePlayer[];
  matchId: string;
}): Promise<void> {
  const supabase = await createClient();
  const user = await getUser();

  const createGameResponse = await supabase
    .from("games")
    .insert({
      match_id: matchId,
      created_by: user.id,
    })
    .select()
    .single();
  if (createGameResponse.error) throw createGameResponse.error;
  const game = createGameResponse.data;

  await Promise.all(
    gamePlayers.map(async ({ id, score, rank }) => {
      const addGamePlayersResponse = await supabase.from("game_players").insert({
        game_id: game.id,
        player_id: id,
        score,
        rank,
      });
      if (addGamePlayersResponse.error) throw addGamePlayersResponse.error;
    }),
  );
}

export async function deleteGame({ gameId }: { gameId: string }): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("games").delete().match({ id: gameId });
  if (error) throw error;
}
