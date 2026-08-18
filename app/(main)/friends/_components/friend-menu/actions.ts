"use server";

import { revalidatePath } from "next/cache";
import { deleteFriends as deleteFriendsData } from "@/lib/data/friend";

export async function deleteFriends(profileId: string) {
  await deleteFriendsData({ profileId });

  revalidatePath("/friends");
}
