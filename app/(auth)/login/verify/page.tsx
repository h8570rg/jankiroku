import { Skeleton, Typography } from "@heroui/react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { maskEmail } from "@/lib/utils/email";
import { getPendingEmail } from "../_lib/otp";
import { BackButton } from "./_components/back-button";
import { VerifyForm } from "./_components/verify-form";

export const metadata: Metadata = {
  title: "ログインコードの入力",
};

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-md">
      <BackButton />
      <Typography type="h1" className="mx-auto mb-4 w-fit text-lg">
        ログインコード入力
      </Typography>
      <Suspense fallback={<Skeleton className="mx-auto mb-6 h-4 w-64 rounded-lg" />}>
        <SentTo />
      </Suspense>
      <VerifyForm />
    </div>
  );
}

/**
 * 送信先のメールアドレスは Cookie から読むので Suspense の中で出す。
 * コード入力欄は先に表示し、すぐに入力できるようにする。
 */
async function SentTo() {
  const email = await getPendingEmail();

  // 直接開いた・Cookie の期限が切れた場合はメールアドレス入力からやり直す
  if (!email) {
    redirect("/login");
  }

  return (
    <Typography type="body-xs" align="center" color="muted" className="mb-6 text-balance">
      {maskEmail(email)} にログインコードを送信しました。
    </Typography>
  );
}
