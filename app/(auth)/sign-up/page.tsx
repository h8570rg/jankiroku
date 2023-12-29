import Link from "next/link";
import { Form } from "./Form";

export default function Login() {
  return (
    <>
      <h1 className="mx-auto mb-2 w-fit text-lg font-bold">新規登録</h1>
      <Form />
      <p className="text-center text-sm">
        既にアカウントをお持ちの方は
        <Link className="link" href="/login">
          ログイン
        </Link>
      </p>
    </>
  );
}
