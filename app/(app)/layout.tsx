import { redirect } from "next/navigation";
import { serverServices } from "~/lib/services";

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

  return <main className="relative min-h-screen px-4 py-5">{children}</main>;
}
