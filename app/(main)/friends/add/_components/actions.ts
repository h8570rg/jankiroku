"use server";

import { revalidatePath } from "next/cache";
import { serverServices } from "@/lib/services/server";

export async function addFriends(profileId: string) {
  const { addFriends: addFriendsService } = await serverServices();
  await addFriendsService({ profileId });

  revalidatePath("/friends");
  revalidatePath("/friends/add");
}
