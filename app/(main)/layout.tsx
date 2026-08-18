import { redirect } from "next/navigation";
import { getNullableUserProfile } from "@/lib/data/user";
import Appbar from "./_components/appbar";
import { ReleaseNotes } from "./_components/release-notes";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getNullableUserProfile();
  if (!profile) {
    redirect("/register");
  }

  return (
    <div className="flex h-full flex-col">
      <Appbar />
      <main className="flex-1 px-4">{children}</main>
      <ReleaseNotes />
    </div>
  );
}
