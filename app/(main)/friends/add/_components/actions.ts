"use server";

import { refresh } from "next/cache";
import { addFriend as addFriendData } from "@/lib/data/friend";

export async function addFriend(profileId: string) {
  await addFriendData({ profileId });

  refresh();
}
