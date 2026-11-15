import { Typography } from "@heroui/react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getNullableUserProfile } from "@/lib/data/user";
import { RegisterForm } from "./_components/register-form";
import { SignOutButton } from "./_components/sign-out-button";

export const metadata: Metadata = {
  title: "ユーザー情報登録",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md">
      <Suspense>
        <RegisteredUserRedirect />
      </Suspense>
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

/**
 * 登録済みのユーザーを /matches へ送る。フォームは先に表示し、確認は Suspense の中で行う。
 */
async function RegisteredUserRedirect() {
  const userProfile = await getNullableUserProfile();
  if (userProfile) {
    redirect("/matches");
  }
  return null;
}
