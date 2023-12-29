import Link from "next/link";
import { Divider } from "~/components/Divider";
import { Form } from "./Form";
import { SocialProviders } from "./SocialProviders";

export default function Login() {
  return (
    <>
      <h1 className="mx-auto mb-2 w-fit text-lg font-bold">ログイン</h1>
      <SocialProviders />
      <div className="flex items-center gap-4">
        <Divider className="shrink" />
        <span>or</span>
        <Divider className="shrink" />
      </div>
      <Form />
      <p className="text-center text-sm">
        アカウントをお持ちでない方は
        <Link className="link" href="/sign-up">
          新規登録
        </Link>
      </p>
    </>
  );
}
