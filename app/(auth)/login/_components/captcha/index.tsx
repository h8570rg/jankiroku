"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import type { Ref } from "react";
import { TURNSTILE_SITE_KEY } from "@/lib/config";

/**
 * Cloudflare Turnstile。ふだんは隠れていて、Cloudflare が操作を求めたときだけチェックボックスを出す。
 * フォームの中に置くと、トークンが隠しフィールド cf-turnstile-response に入る。トークンは Supabase が検証する。
 *
 * @param execution "execute" なら、ref.execute() を呼ぶまで確認を始めない（操作の直後にだけ確認したいとき）
 */
export function Captcha({
  ref,
  execution,
  className,
}: {
  ref?: Ref<TurnstileInstance | undefined>;
  execution?: "render" | "execute";
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
        execution,
      }}
    />
  );
}
