import { Typography } from "@heroui/react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getNullableUserProfile } from "@/lib/data/user";
import { RegisterForm } from "./_components/register-form";
import { SignOutButton } from "./_components/sign-out-button";

export const metadata: Metadata = {
  title: "ユーザー情報登録",
};

export default async function RegisterPage() {
  const userProfile = await getNullableUserProfile();

  if (userProfile) {
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
        <SignOutButton />
      </div>
    </div>
  );
}
