"use server";

import { revalidatePath } from "next/cache";
import { serverServices } from "@/lib/services/server";

export async function addFriends(_prevState: unknown, formData: FormData) {
  const profileId = formData.get("profileId") as string;

  const { addFriends } = await serverServices();

  await addFriends({ profileId });

  revalidatePath("/friends");
  return {
    success: true,
  };
}
