"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/server";

export async function signOut() {
  const supabase = createClient();

  await supabase.auth.signOut();

  /**
   * @see https://nextjs.org/docs/app/api-reference/functions/revalidatePath#revalidating-all-data
   */
  revalidatePath("/", "layout");
  redirect("/login");
}

/** @see https://github.com/orgs/supabase/discussions/20905 */
// middlewareの代わりにsessionの更新をする
export async function getUser() {
  const supabase = createClient();
  return supabase.auth.getUser();
}
