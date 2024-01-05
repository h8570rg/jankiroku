"use server";

import { revalidatePath } from "next/cache";
import { serverServices } from "~/lib/services";

export async function deleteFriends(profileId: string) {
  const { deleteFriends } = serverServices();

  await deleteFriends({ profileId });

  revalidatePath("/friends");
}
