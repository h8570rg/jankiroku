"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { type Ref, useEffect, useRef, useState } from "react";
import { TURNSTILE_SITE_KEY } from "@/lib/config";
import { CAPTCHA_FIELD_NAME } from "../../_lib/captcha";

export type CaptchaStatus = "loading" | "ready" | "error";

/**
 * ログインコードの送信を Cloudflare Turnstile で守る。ボットが Auth API を直接叩いて
 * 任意のアドレスにメールを送らせるのを防ぐため、トークンは Supabase（signInWithOtp の captchaToken）が検証する。
 *
 * ふだんは何も表示せず、Turnstile が操作を求めたときだけチェックボックスを出す（interaction-only）。
 * フォームの中に置くと、トークンが CAPTCHA_FIELD_NAME の隠しフィールドに入る。
 * トークンは 1 回しか使えないので、送信が終わったら ref.reset() で取り直す。
 * サイトキーがない（本番で未設定）なら何も描画しない。
 *
 * @param visibleClassName ウィジェットが見えている間だけ付けるクラス（余白など）。
 *   隠れている間も枠の要素は残るので、常に余白を付けるとフォームの間隔が広がってしまう。
 *   見えているかどうかは Cloudflare が iframe の高さで決めるので、高さで判断する
 *   （操作が終わったあとも「成功しました」が表示されたままになる）。
 */
export function Captcha({
  ref,
  onStatusChange,
  visibleClassName,
}: {
  ref?: Ref<TurnstileInstance | undefined>;
  onStatusChange?: (status: CaptchaStatus) => void;
  visibleClassName?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      setIsVisible(entry.contentRect.height > 0);
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  if (!TURNSTILE_SITE_KEY) {
    return null;
  }

  return (
    <div ref={wrapperRef} className={isVisible ? visibleClassName : undefined}>
      <Turnstile
        ref={ref}
        siteKey={TURNSTILE_SITE_KEY}
        options={{
          appearance: "interaction-only",
          language: "ja",
          size: "flexible",
          responseFieldName: CAPTCHA_FIELD_NAME,
        }}
        onWidgetLoad={() => onStatusChange?.("loading")}
        onSuccess={() => onStatusChange?.("ready")}
        onExpire={() => onStatusChange?.("loading")}
        onError={() => onStatusChange?.("error")}
        onUnsupported={() => onStatusChange?.("error")}
      />
    </div>
  );
}

/** CAPTCHA を出さない環境では、最初から送信できる状態にする */
export const INITIAL_CAPTCHA_STATUS: CaptchaStatus = TURNSTILE_SITE_KEY ? "loading" : "ready";
