"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getNullableUserProfile } from "@/lib/data/user";
import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/utils/url";
import { requestOtpSchema, verifyOtpSchema } from "./schema";

/**
 * メールアドレス宛にログイン用のワンタイムコードを送信する。未登録ならユーザーを作成する。
 * @see https://supabase.com/docs/guides/auth/auth-email-passwordless
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
        formErrors: [error],
      },
    });
  }

  return { ...report(submission, {}), email };
}

/**
 * コード入力画面からの再送用。エラー時はメッセージを返す。
 */
export async function resendOtp(email: string): Promise<string | null> {
  const result = requestOtpSchema.safeParse({ email });
  if (!result.success) {
    return "メールアドレスが正しくありません。";
  }
  return sendOtp(result.data.email);
}

async function sendOtp(email: string): Promise<string | null> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (!error) {
    return null;
  }
  if (error.code === "over_email_send_rate_limit") {
    return "短時間に送信できる回数を超えました。しばらくしてから再度お試しください。";
  }
  return "コードを送信できませんでした。";
}

/**
 * @see https://supabase.com/docs/guides/auth/auth-email-passwordless#with-otp
 */
export async function verifyOtp(_prevState: unknown, formData: FormData) {
  const submission = parseSubmission(formData);
  const result = verifyOtpSchema.safeParse(submission.payload);

  if (!result.success) {
    return report(submission, {
      error: {
        issues: result.error.issues,
      },
    });
  }
  const { email, token } = result.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    return report(submission, {
      error: {
        formErrors: ["コードが正しくないか、有効期限が切れています。"],
      },
    });
  }

  const userProfile = await getNullableUserProfile();

  revalidatePath("/", "layout");
  redirect(userProfile ? "/matches" : "/register");
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
