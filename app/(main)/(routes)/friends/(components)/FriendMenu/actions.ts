"use server";

import { revalidatePath } from "next/cache";
import { serverServices } from "@/lib/services/server";

export async function deleteFriends(profileId: string) {
  const { deleteFriends } = await serverServices();

  await deleteFriends({ profileId });

  revalidatePath("/friends");
}
