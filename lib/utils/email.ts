/**
 * 画面表示用にメールアドレスのローカル部を伏せる。
 * 例: `test@example.com` → `t***@example.com`
 */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf("@");
  if (at <= 0) return email;
  return `${email[0]}***${email.slice(at)}`;
}
