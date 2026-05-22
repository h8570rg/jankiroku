"use server";

import { serverServices } from "@/lib/services/server";
import type { Player } from "@/lib/type";

export async function searchPlayers(text: string): Promise<Player[]> {
  if (!text) {
    return [];
  }

  const { searchPlayers } = await serverServices();
  return await searchPlayers({ text });
}
