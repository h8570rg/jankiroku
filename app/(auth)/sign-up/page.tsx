import type { Metadata } from "next";
import NextLink from "next/link";
import { linkVariants } from "@/components/link";
import { SignUpForm } from "./_components/sign-up-form";

export const metadata: Metadata = {
  title: "新規登録",
};

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mx-auto mb-2 w-fit text-lg">新規登録</h1>
      <SignUpForm />
      <p className="text-center text-sm">
        既にアカウントをお持ちの方は
        <NextLink className={linkVariants().base()} href="/login">
          ログイン
        </NextLink>
      </p>
    </div>
  );
}
