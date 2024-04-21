import { Metadata } from "next";
import Link from "next/link";
import { Divider } from "~/components/Divider";
import { Form } from "./Form";
import { SocialProviders } from "./SocialProviders";

export const metadata: Metadata = {
  title: "ログイン",
};

export default function Login() {
  return (
    <>
      <h1 className="mx-auto mb-4 w-fit text-large font-bold">ログイン</h1>
      <SocialProviders />
      <div className="my-4 flex items-center gap-4">
        <Divider className="shrink" />
        <span>or</span>
        <Divider className="shrink" />
      </div>
      <Form />
      <p className="mt-4 text-center text-small">
        アカウントをお持ちでない方は
        <Link className="link" href="/sign-up">
          新規登録
        </Link>
      </p>
    </>
  );
}
