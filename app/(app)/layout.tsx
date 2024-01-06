import { redirect } from "next/navigation";
import { Suspense } from "react";
import { serverServices } from "~/lib/services";
import Navbar from "./Navbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getUserProfile } = serverServices();
  const profile = await getUserProfile();
  if (!profile.janrecoId || !profile.name) {
    redirect("/register");
  }

  return (
    <div className="min-h-screen">
      {/* @see https://nextjs.org/docs/app/api-reference/functions/use-router#router-events */}
      <Suspense fallback={null}>
        <Navbar name={profile.name} janrecoId={profile.janrecoId} />
      </Suspense>
      <main className="px-4 pb-5">{children}</main>
    </div>
  );
}
