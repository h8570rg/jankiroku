import Image from "next/image";
import Link from "next/link";
import { signInWithGoogle } from "@/apis/client/auth";
import GoogleIconNormal from "@/public/google/vector/btn_google_light_normal_ios.svg";
import { NextPageWithLayout } from "@/types";

const Signin: NextPageWithLayout = () => {
  return (
    <div className="h- w-full relative">
      <div className="h-screen w-full relative">
        <Image src="/bg/mahjong1.jpeg" alt="bg" layout="fill" />
        <div className="absolute inset-0 backdrop-blur-sm"></div>
      </div>
      <div className="absolute top-0">
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
    </div>
  );
};

Signin.getLayout = (page) => page;

export default Signin;
