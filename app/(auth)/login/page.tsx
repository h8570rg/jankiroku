import type { Metadata } from "next";
import NextLink from "next/link";
import { linkVariants } from "@/components/link";
import { Separator } from "@/components/separator";
import { LoginForm } from "./_components/login-form";
import { SocialProviders } from "./_components/social-providers";

export const metadata: Metadata = {
  title: "ログイン",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mx-auto mb-4 w-fit text-lg">ログイン</h1>
      <SocialProviders />
      <div className="my-4 flex items-center gap-4">
        <Separator className="shrink" />
        <span>or</span>
        <Separator className="shrink" />
      </div>
      <LoginForm />
      <p className="mt-4 text-center text-sm">
        アカウントをお持ちでない方は
        <NextLink className={linkVariants().base()} href="/sign-up">
          新規登録
        </NextLink>
      </p>
    </div>
  );
}
