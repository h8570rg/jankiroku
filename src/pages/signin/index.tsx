import { signInWithGoogle } from "src/apis/auth";
import Link from "next/link";
import GoogleIconNormal from "public/google/vector/btn_google_light_normal_ios.svg";

export default function Signin() {
  return (
    <div>
      <Link href="/signup" passHref>
        <a>新規アカウント作成</a>
      </Link>
      {/* <Link href="/login/email" passHref>
        <a>メールアドレスでログイン</a>
      </Link> */}
      <button onClick={signInWithGoogle}>
        <GoogleIconNormal />
      </button>
    </div>
  );
}
