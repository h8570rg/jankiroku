"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import type { Ref } from "react";
import { TURNSTILE_SITE_KEY } from "@/lib/config";

export type CaptchaStatus = "loading" | "ready" | "error";

/**
 * ログインコードの送信を Cloudflare Turnstile で守る。ボットが Auth API を直接叩いて
 * 任意のアドレスにメールを送らせるのを防ぐため、トークンは Supabase（signInWithOtp の captchaToken）が検証する。
 *
 * ふだんは何も表示せず、Turnstile が操作を求めたときだけチェックボックスを出す（interaction-only）。
 * フォームの中に置くと、トークンが cf-turnstile-response という隠しフィールドに入る。
 * トークンは 1 回しか使えないので、送信が終わったら ref.reset() で取り直す。
 * サイトキーがない（本番で未設定）なら何も描画しない。
 *
 * 隠れている間も枠の要素は高さ 0 で残る。余白は、置く側でマージンの相殺を使って付ける（login-form を参照）。
 */
export function Captcha({
  ref,
  onStatusChange,
  className,
}: {
  ref?: Ref<TurnstileInstance | undefined>;
  onStatusChange?: (status: CaptchaStatus) => void;
  className?: string;
}) {
  if (!TURNSTILE_SITE_KEY) {
    return null;
  }

  return (
    <Turnstile
      ref={ref}
      siteKey={TURNSTILE_SITE_KEY}
      className={className}
      options={{
        appearance: "interaction-only",
        language: "ja",
        size: "flexible",
      }}
      onWidgetLoad={() => onStatusChange?.("loading")}
      onSuccess={() => onStatusChange?.("ready")}
      onExpire={() => onStatusChange?.("loading")}
      onError={() => onStatusChange?.("error")}
      onUnsupported={() => onStatusChange?.("error")}
    />
  );
}

/** CAPTCHA を出さない環境では、最初から送信できる状態にする */
export const INITIAL_CAPTCHA_STATUS: CaptchaStatus = TURNSTILE_SITE_KEY ? "loading" : "ready";
