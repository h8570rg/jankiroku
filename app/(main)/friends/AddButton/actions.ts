"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverServices } from "~/lib/services/server";

export async function addFriends(profileId: string) {
  const { addFriends } = serverServices();

  await addFriends({ profileId });

  revalidatePath("/friends");
  redirect("/friends");
}
