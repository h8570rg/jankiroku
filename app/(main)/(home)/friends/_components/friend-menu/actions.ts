"use server";

import { revalidatePath } from "next/cache";
import { deleteFriend as deleteFriendData } from "@/lib/data/friend";

export async function deleteFriend(profileId: string) {
  await deleteFriendData({ profileId });

  revalidatePath("/friends");
}
