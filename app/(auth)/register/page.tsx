import { Metadata } from "next";
import { redirect } from "next/navigation";
import { services } from "~/lib/services";
import { createSupabaseServerComponentClient } from "~/lib/utils/supabase/serverComponentClient";
import { Form } from "./Form";

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
    <>
      <h1 className="mx-auto mb-2 w-fit text-large font-bold">
        ユーザー情報登録
      </h1>
      <Form userId={user.id} />
    </>
  );
}
