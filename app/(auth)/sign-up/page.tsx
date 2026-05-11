import { linkVariants, Text } from "@heroui/react";
import type { Metadata } from "next";
import NextLink from "next/link";
import { SignUpForm } from "./_components/sign-up-form";

export const metadata: Metadata = {
  title: "新規登録",
};

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md">
      <Text type="h1" className="mx-auto mb-2 w-fit text-lg">
        新規登録
      </Text>
      <SignUpForm />
      <Text type="body-sm" align="center">
        既にアカウントをお持ちの方は
        <NextLink className={linkVariants().base()} href="/login">
          ログイン
        </NextLink>
      </Text>
    </div>
  );
}
