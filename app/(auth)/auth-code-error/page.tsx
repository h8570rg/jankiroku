import Link from "next/link";
import { Button } from "@/components/Button";

/**
 * @see https://supabase.com/docs/guides/auth/server-side/oauth-with-pkce-flow-for-ssr
 */
export default function Page() {
  return (
    <div className="flex flex-col items-center">
      <h1>ログインに失敗しました</h1>
      <Button as={Link} href="/login" className="mt-4" color="primary">
        ログイン画面へ戻る
      </Button>
    </div>
  );
}
