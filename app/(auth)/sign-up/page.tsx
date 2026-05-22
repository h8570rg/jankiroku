import { linkVariants, Typography } from "@heroui/react";
import type { Metadata } from "next";
import NextLink from "next/link";
import { SignUpForm } from "./_components/sign-up-form";

export const metadata: Metadata = {
  title: "新規登録",
};

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md">
      <Typography type="h1" className="mx-auto mb-2 w-fit text-lg">
        新規登録
      </Typography>
      <SignUpForm />
      <Typography type="body-sm" align="center">
        既にアカウントをお持ちの方は
        <NextLink className={linkVariants().base()} href="/login">
          ログイン
        </NextLink>
      </Typography>
    </div>
  );
}
