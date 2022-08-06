import bgMahjong1Image from "@images/bg/mahjong1.jpeg";
import GoogleIconNormalSvg from "@svgs/google/btn_google_light_normal_ios.svg";
import Image from "next/image";
import Link from "next/link";
import { signInWithGoogle } from "@/apis/client/auth";
import { NextPageWithLayout } from "@/types";

const Signin: NextPageWithLayout = () => {
  return (
    <div className="h- w-full relative">
      <div className="h-screen w-full relative">
        <Image src={bgMahjong1Image} alt="bg" layout="fill" />
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
          <GoogleIconNormalSvg />
        </button>
      </div>
    </div>
  );
};

Signin.getLayout = (page) => page;

export default Signin;
