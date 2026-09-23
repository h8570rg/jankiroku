import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function deleteGame({ gameId }: { gameId: string }): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("games").delete().match({ id: gameId });
  if (error) throw error;
}
