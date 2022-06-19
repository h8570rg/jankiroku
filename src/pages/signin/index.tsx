import Link from "next/link";
import { signInWithGoogle } from "@/apis/client/auth";
import GoogleIconNormal from "@/public/google/vector/btn_google_light_normal_ios.svg";

const Signin = () => {
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
};

export default Signin;
