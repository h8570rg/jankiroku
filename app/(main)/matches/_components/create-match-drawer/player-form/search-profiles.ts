"use server";

import { serverServices } from "@/lib/services/server";
import type { Profile } from "@/lib/type";

export async function searchProfiles(text: string): Promise<Profile[]> {
  if (!text) {
    return [];
  }

  const { searchProfiles } = await serverServices();
  const profiles = await searchProfiles({ text });
  return profiles;
}
