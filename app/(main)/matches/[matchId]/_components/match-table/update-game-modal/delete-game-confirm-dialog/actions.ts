"use server";

import { revalidatePath } from "next/cache";
import { deleteGame as deleteGameData } from "@/lib/data/game";

export async function deleteGame({ gameId, matchId }: { gameId: string; matchId: string }) {
  await deleteGameData({ gameId });

  revalidatePath(`/matches/${matchId}`);
}
