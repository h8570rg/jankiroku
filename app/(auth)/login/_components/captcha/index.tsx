"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import type { Ref } from "react";
import { TURNSTILE_SITE_KEY } from "@/lib/config";

/**
 * Cloudflare Turnstile。トークンは Supabase が検証する（signInWithOtp の captchaToken）。
 * ふだんは隠れていて、Cloudflare が操作を求めたときだけチェックボックスを出す。
 * フォームの中に置くとトークンが隠しフィールド cf-turnstile-response に入る。1 回しか使えないので、使ったら ref.reset() で取り直す。
 *
 * @param onReadyChange 送信してよいかが変わったときに呼ぶ。確認に失敗したときも true にして、
 *   送信させて Supabase のエラー（captcha_failed）を出す
 */
export function Captcha({
  ref,
  onReadyChange,
  className,
}: {
  ref?: Ref<TurnstileInstance | undefined>;
  onReadyChange?: (isReady: boolean) => void;
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
      onSuccess={() => onReadyChange?.(true)}
      onExpire={() => onReadyChange?.(false)}
      onError={() => onReadyChange?.(true)}
      onUnsupported={() => onReadyChange?.(true)}
    />
  );
}
