/**
 * Turnstile がフォームに入れる隠しフィールドの名前（Turnstile の既定値）。
 * Server Action からも読むので、"use client" のファイルには置かない。
 */
export const CAPTCHA_FIELD_NAME = "cf-turnstile-response";

/**
 * フォームから CAPTCHA のトークンを取り出す。CAPTCHA を出していなければ undefined。
 */
export function getCaptchaToken(formData: FormData): string | undefined {
  const token = formData.get(CAPTCHA_FIELD_NAME);
  return typeof token === "string" && token !== "" ? token : undefined;
}
