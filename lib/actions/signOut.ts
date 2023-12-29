"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerComponentClient } from "~/lib/utils/supabase/serverComponentClient";

export async function signOut() {
  const supabase = createSupabaseServerComponentClient();

  await supabase.auth.signOut();

  revalidatePath("/");
  redirect("/login");
}
