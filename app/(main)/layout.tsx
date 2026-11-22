import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getNullableUserProfile } from "@/lib/data/user";
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
 * 各画面の `getUserProfile()` も同じ行き先へリダイレクトするので、どちらが先に終わっても結果は同じ。
 */
async function RegistrationGuard() {
  const userProfile = await getNullableUserProfile();
  if (!userProfile) {
    redirect("/register");
  }
  return null;
}
