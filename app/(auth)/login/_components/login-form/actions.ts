"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/utils/url";
import { signInEmailSchema } from "./schema";

/**
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function signInEmail(_prevState: unknown, formData: FormData) {
  const submission = parseSubmission(formData);
  const result = signInEmailSchema.safeParse(submission.payload);

  if (!result.success) {
    return report(submission, {
      error: {
        issues: result.error.issues,
      },
    });
  }
  const { email, password } = result.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return report(submission, {
      error: {
        formErrors: ["メールアドレスまたはパスワードが間違っています。"],
      },
    });
  }

  revalidatePath("/", "layout");
  redirect("/matches");
}

/**
 * @see https://supabase.com/docs/guides/auth/server-side/oauth-with-pkce-flow-for-ssr?queryGroups=environment&environment=server
 */
export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getURL()}api/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}

export async function signInAnonymously() {
  const supabase = await createClient();
  await supabase.auth.signInAnonymously();

  redirect("/matches");
}
