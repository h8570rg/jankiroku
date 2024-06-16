"use server";

import { revalidatePath } from "next/cache";
import { serverServices } from "@/lib/services/server";
import { Profile } from "@/lib/type";

export async function updateMatchPlayers({
  matchId,
  playerIds,
}: {
  matchId: string;
  playerIds: string[];
}) {
  const { updateMatchPlayers } = serverServices();
  await updateMatchPlayers({ matchId, playerIds });
  revalidatePath(`/matches/${matchId}`);
  return;
}

export async function searchProfiles(text: string): Promise<Profile[]> {
  if (!text) {
    return [];
  }

  const { searchProfiles } = serverServices();
  const profiles = await searchProfiles({ text });
  return profiles;
}
