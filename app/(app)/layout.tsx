import { redirect } from "next/navigation";
import { services } from "~/lib/services";
import { createSupabaseServerComponentClient } from "~/lib/utils/supabase/serverComponentClient";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseClient = createSupabaseServerComponentClient();
  const { getUserProfile } = services(supabaseClient);
  const profile = await getUserProfile();
  if (!profile.janrecoId || !profile.name) {
    redirect("/register");
  }

  return <main className="relative min-h-screen px-4 py-5">{children}</main>;
}
