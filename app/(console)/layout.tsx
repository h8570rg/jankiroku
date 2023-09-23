import { redirect } from "next/navigation";
import { services } from "~/lib/services";
import { createSupabaseClient } from "~/lib/utils/supabase/serverComponentClient";

export default async function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseClient = createSupabaseClient();
  const { getUserProfile } = services(supabaseClient);
  const profile = await getUserProfile();
  if (!profile.janrecoId || !profile.name) {
    redirect("/register");
  }

  return <main className="relative min-h-screen px-4 py-5">{children}</main>;
}
