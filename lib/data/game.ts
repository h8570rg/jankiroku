import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function deleteGame({ gameId }: { gameId: string }) {
  const supabase = await createClient();
  await supabase.from("games").delete().match({ id: gameId });
}
