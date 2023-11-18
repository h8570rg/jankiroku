import { Metadata } from "next";
import { redirect } from "next/navigation";
import Logo from "~/components/Logo";
import { services } from "~/lib/services";
import { createSupabaseServerComponentClient } from "~/lib/utils/supabase/serverComponentClient";
import ProfileForm from "./ProfileForm";

export const metadata: Metadata = {
  title: "ユーザー情報登録",
};

export default async function Register() {
  const supabaseClient = createSupabaseServerComponentClient();
  const { getUserProfile } = services(supabaseClient);
  const user = await getUserProfile();

  if (user.name && user.janrecoId) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col gap-4 p-5">
      <Logo className="shrink-0 text-3xl" />
      <ProfileForm className="grow" userId={user.id} />
    </div>
  );
}
