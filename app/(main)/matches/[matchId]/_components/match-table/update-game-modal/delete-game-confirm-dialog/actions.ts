"use server";

import { refresh } from "next/cache";
import { deleteGame as deleteGameData } from "@/lib/data/game";

export async function deleteGame({ gameId }: { gameId: string }) {
  await deleteGameData({ gameId });

  refresh();
}
