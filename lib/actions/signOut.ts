"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerComponentClient } from "~/lib/utils/supabase/serverComponentClient";

export async function signOut() {
  const supabase = createSupabaseServerComponentClient();

  await supabase.auth.signOut();

  /**
   * @see https://nextjs.org/docs/app/api-reference/functions/revalidatePath#revalidating-all-data
   */
  revalidatePath("/", "layout");
  redirect("/login");
}
