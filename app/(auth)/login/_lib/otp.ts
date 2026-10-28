import "server-only";
import { cookies } from "next/headers";
import { OTP_EXPIRY_MINUTES } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

/**
 * コードの送信先メールアドレスを /login → /login/verify へ受け渡す Cookie。
 * URL に個人情報を載せないため、httpOnly かつ /login 配下だけに送る。
 * 中身は送信先アドレスのみで認証情報ではない（照合は Supabase の verifyOtp が行う）。
 */
const PENDING_EMAIL_COOKIE = "otp_pending_email";
const PENDING_EMAIL_COOKIE_PATH = "/login";

export async function setPendingEmail(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(PENDING_EMAIL_COOKIE, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: PENDING_EMAIL_COOKIE_PATH,
    maxAge: OTP_EXPIRY_MINUTES * 60,
  });
}

export async function getPendingEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(PENDING_EMAIL_COOKIE)?.value || null;
}

export async function clearPendingEmail() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: PENDING_EMAIL_COOKIE, path: PENDING_EMAIL_COOKIE_PATH });
}

/**
 * メールアドレス宛にログイン用のワンタイムコードを送信する。未登録ならユーザーを作成する。
 * 登録済みかどうかで結果を変えないため、アカウントの有無は外から判別できない。
 * @see https://supabase.com/docs/guides/auth/auth-email-passwordless
 * @returns エラー時は画面に出すメッセージ、成功時は null
 */
export async function sendOtp(email: string): Promise<string | null> {
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
