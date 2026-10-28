"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/utils/url";
import { sendOtp, setPendingEmail } from "../../_lib/otp";
import { requestOtpSchema } from "./schema";

/**
 * コードを送信し、送信先を Cookie に残してコード入力画面へ進む。
 */
export async function requestOtp(_prevState: unknown, formData: FormData) {
  const submission = parseSubmission(formData);
  const result = requestOtpSchema.safeParse(submission.payload);

  if (!result.success) {
    return report(submission, {
      error: {
        issues: result.error.issues,
      },
    });
  }
  const { email } = result.data;

  const error = await sendOtp(email);

  if (error) {
    return report(submission, {
      error: {
        fieldErrors: { email: [error] },
      },
    });
  }

  await setPendingEmail(email);
  redirect("/login/verify");
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
