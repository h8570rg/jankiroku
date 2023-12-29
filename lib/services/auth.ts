"use server";

import { createSupabaseServerComponentClient } from "~/lib/utils/supabase/serverComponentClient";

export async function signInEmail(email: string, password: string) {
  const supabase = createSupabaseServerComponentClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      errorMessage: error.message,
    };
  }

  return {};
}
