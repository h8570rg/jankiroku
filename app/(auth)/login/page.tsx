import { linkVariants, Separator, Typography } from "@heroui/react";
import type { Metadata } from "next";
import NextLink from "next/link";
import { LoginForm } from "./_components/login-form";
import { SocialProviders } from "./_components/social-providers";

export const metadata: Metadata = {
  title: "ログイン",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <Typography type="h1" className="mx-auto mb-4 w-fit text-lg">
        ログイン
      </Typography>
      <SocialProviders />
      <div className="my-4 flex items-center gap-4">
        <Separator className="shrink" />
        <span>or</span>
        <Separator className="shrink" />
      </div>
      <LoginForm />
      <Typography type="body-sm" align="center" className="mt-4">
        アカウントをお持ちでない方は
        <NextLink className={linkVariants().base()} href="/sign-up">
          新規登録
        </NextLink>
      </Typography>
    </div>
  );
}
