import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { NextPageWithLayout } from "@/types";
import bgMahjong1Image from "@images/bg/mahjong1.jpeg";
import GoogleIconNormalSvg from "@svgs/google/btn_google_light_normal_ios.svg";
import { METHOD } from "~/services/auth";

const Signin: NextPageWithLayout = () => {
  const router = useRouter();

  // 認証後もとのページに戻ってくるので、先にリダイレクトページに遷移してから認証
  const handleGoogleSigninClick = useCallback(() => {
    router.push({
      pathname: "/signin/redirect",
      query: {
        method: METHOD.GOOGLE,
      },
    });
  }, [router]);

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
        <button onClick={handleGoogleSigninClick}>
          <GoogleIconNormalSvg />
        </button>
      </div>
    </div>
  );
};

Signin.getLayout = (page) => page;

export default Signin;
