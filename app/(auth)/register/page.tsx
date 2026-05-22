import { linkVariants, Typography } from "@heroui/react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { serverServices } from "@/lib/services/server";
import { RegisterForm } from "./_components/register-form";
import { signOut } from "./_components/register-form/actions";

export const metadata: Metadata = {
  title: "ユーザー情報登録",
};

export default async function RegisterPage() {
  const { getNullableUserProfile } = await serverServices();
  const profile = await getNullableUserProfile();

  if (profile) {
    redirect("/matches");
  }

  return (
    <div className="mx-auto max-w-md">
      <Typography type="h1" className="mx-auto mb-4 w-fit text-lg">
        ユーザー情報登録
      </Typography>
      <Typography type="body-sm" color="muted" className="mb-6">
        ユーザーIDと名前を決めてください。
        <br />
        ユーザーIDはユーザー検索に、名前は成績表に使用されます。
      </Typography>
      <RegisterForm />
      <div className="mt-10 flex justify-center">
        <button
          className={linkVariants().base()}
          type="button"
          onClick={signOut}
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}
