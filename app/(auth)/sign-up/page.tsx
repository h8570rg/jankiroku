import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "./_components/sign-up-form";

export const metadata: Metadata = {
  title: "新規登録",
};

export default function SignUpPage() {
  return (
    <>
      <h1 className="mx-auto mb-2 w-fit text-lg">新規登録</h1>
      <SignUpForm />
      <p className="text-center text-sm">
        既にアカウントをお持ちの方は
        <Link className="link" href="/login">
          ログイン
        </Link>
      </p>
    </>
  );
}
