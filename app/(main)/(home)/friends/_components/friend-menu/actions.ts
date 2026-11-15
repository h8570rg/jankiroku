"use server";

import { refresh } from "next/cache";
import { deleteFriend as deleteFriendData } from "@/lib/data/friend";

export async function deleteFriend(profileId: string) {
  await deleteFriendData({ profileId });

  refresh();
}
