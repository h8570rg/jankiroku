"use server";

import { revalidatePath } from "next/cache";
import { addFriend as addFriendData } from "@/lib/data/friend";

export async function addFriend(profileId: string) {
  await addFriendData({ profileId });

  revalidatePath("/friends");
  revalidatePath("/friends/add");
}
