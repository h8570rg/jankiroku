import { LinkButton } from "@/components/LinkButton";

/**
 * @see https://supabase.com/docs/guides/auth/server-side/oauth-with-pkce-flow-for-ssr
 */
export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-col items-center">
      <h1>ログインに失敗しました</h1>
      <LinkButton href="/login" className="mt-4" color="primary">
        ログイン画面へ戻る
      </LinkButton>
    </div>
  );
}
