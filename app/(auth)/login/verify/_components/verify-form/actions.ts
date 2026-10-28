"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getNullableUserProfile } from "@/lib/data/user";
import { createClient } from "@/lib/supabase/server";
import { clearPendingEmail, getPendingEmail, sendOtp, setPendingEmail } from "../../../_lib/otp";
import { verifyOtpSchema } from "./schema";

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
  const { token } = result.data;

  const email = await getPendingEmail();
  if (!email) {
    redirect("/login");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    return report(submission, {
      error: {
        fieldErrors: { token: ["コードが正しくないか、有効期限が切れています。"] },
      },
      // 入力し直しやすいようにコードを空に戻す
      targetValue: { token: "" },
    });
  }

  await clearPendingEmail();
  const userProfile = await getNullableUserProfile();

  revalidatePath("/", "layout");
  redirect(userProfile ? "/matches" : "/register");
}

/**
 * Cookie に残っている送信先へコードを再送する。
 * @returns エラー時は画面に出すメッセージ、成功時は null
 */
export async function resendOtp(): Promise<string | null> {
  const email = await getPendingEmail();
  if (!email) {
    redirect("/login");
  }
  const error = await sendOtp(email);
  if (!error) {
    // Cookie の有効期限を新しいコードに合わせて延ばす
    await setPendingEmail(email);
  }
  return error;
}
