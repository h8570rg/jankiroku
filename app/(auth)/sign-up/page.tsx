import { Metadata } from "next";
import Link from "next/link";
import { Form } from "./Form";

export const metadata: Metadata = {
  title: "新規登録",
};

export default function Login() {
  return (
    <>
      <h1 className="mx-auto mb-2 w-fit text-large font-bold">新規登録</h1>
      <Form />
      <p className="text-center text-small">
        既にアカウントをお持ちの方は
        <Link className="link" href="/login">
          ログイン
        </Link>
      </p>
    </>
  );
}
