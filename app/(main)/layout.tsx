import { redirect } from "next/navigation";
import { getNullableUserProfile } from "@/lib/data/user";
import Appbar from "./_components/appbar";

// TODO(#150): Cache Components 移行のため一時的にブロッキングを許可している。
// Suspense 境界を整理したら外す。https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userProfile = await getNullableUserProfile();
  if (!userProfile) {
    redirect("/register");
  }

  return (
    <div className="flex h-full flex-col">
      <Appbar />
      <main className="flex-1 px-4">{children}</main>
    </div>
  );
}
