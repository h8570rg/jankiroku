"use client";

/** @see https://knmts.com/as-a-engineer-81/ */
export function getIsWebview() {
  const ua = navigator.userAgent.toLowerCase();
  const isLine = /line/.test(ua);

  const isWebview = isLine; // 他にもあるかもしれないが、LINEだけ動作確認済み
  return isWebview;
}
