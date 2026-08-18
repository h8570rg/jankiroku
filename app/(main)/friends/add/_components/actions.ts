"use server";

import { revalidatePath } from "next/cache";
import { addFriends as addFriendsData } from "@/lib/data/friend";

export async function addFriends(profileId: string) {
  await addFriendsData({ profileId });

  revalidatePath("/friends");
  revalidatePath("/friends/add");
}
