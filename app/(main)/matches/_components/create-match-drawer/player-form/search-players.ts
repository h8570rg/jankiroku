"use server";

import { searchPlayers as searchPlayersData } from "@/lib/data/player";
import type { Player } from "@/lib/type";

export async function searchPlayers(text: string): Promise<Player[]> {
  if (!text) {
    return [];
  }

  return searchPlayersData({ text });
}
