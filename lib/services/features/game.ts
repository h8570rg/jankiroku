import type { Supabase } from ".";

export const gameService = (supabase: Supabase) => {
  return {
    deleteGame: async ({ gameId }: { gameId: string }) => {
      await supabase.from("games").delete().match({ id: gameId });
    },
  };
};
