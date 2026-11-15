import { Suspense } from "react";
import { getUserProfile } from "@/lib/data/user";
import Appbar from "./_components/appbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <Suspense>
        <RegistrationGuard />
      </Suspense>
      <Appbar />
      <main className="flex-1 px-4">{children}</main>
    </div>
  );
}

/**
 * 未登録のユーザーを `/register` へ送る。
 * layout の先頭で待つと配下の画面がすべてこの問い合わせを待つため、Suspense の中で確かめる。
 * 各画面のデータ取得も `getUserProfile()` を経由するので、どちらが先に終わっても同じリダイレクトになる。
 */
async function RegistrationGuard() {
  await getUserProfile();
  return null;
}
