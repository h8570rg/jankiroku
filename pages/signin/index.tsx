import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Logo from "~/components/Logo";
import GoogleIcon from "~/lib/assets/images/g-logo.png";
import MahJong1Image from "~/lib/assets/images/mahjong1.jpeg";
import { useLoading } from "~/lib/hooks/loading";

const AnonymousSelectionOverlay = ({
  className,
  onSigninButtonClick,
  onAnonymousSigninButtonClick,
}: {
  className?: string;
  onSigninButtonClick?: VoidFunction;
  onAnonymousSigninButtonClick?: VoidFunction;
  loading: boolean;
}) => {
  return (
    <div className={classNames("relative h-full", className)}>
      <div className="absolute inset-0"></div>
      <Image
        src={MahJong1Image}
        objectFit="cover"
        className="animate-expansion"
        alt="mahjong"
      />
      <div className="absolute inset-0 opacity-95"></div>
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-sm">
          <Logo className="mx-auto mb-10 w-fit" />
          <div className="space-y-4">
            <button
              className="rounded-full font-bold"
              onClick={onSigninButtonClick}
            >
              ログイン/新規登録
            </button>
            <button
              className="rounded-full font-bold"
              onClick={onAnonymousSigninButtonClick}
            >
              ログインせずに始める
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Signin() {
  const loading = useLoading();
  const [showOverlay] = useState(true);

  return (
    <div className="relative flex h-screen items-center overflow-hidden">
      <div className="max-h-full max-w-sm overflow-y-auto px-6 py-10">
        <div className="mx-auto mb-10 w-fit font-bold">ログイン</div>
        <div className="mx-auto w-[300px]">
          <button className="shadow">
            <Image src={GoogleIcon} height={32} width={32} alt="google" />
          </button>
        </div>
        <div className="my-10">
          <span className="px-3">or</span>
        </div>
        <form>
          <div className="mx-auto space-y-5">
            <button type="submit" className="w-full rounded-full">
              ログイン
            </button>
            <Link
              href="/signin/reset-password"
              className="ml-auto w-fit text-xs"
            >
              パスワードをお忘れの場合
            </Link>
          </div>
        </form>
        <p className="mx-auto mt-20 w-fit text-xs">
          <span className="mr-1">アカウントをお持ちでない場合</span>
          <Link href="/signup" className="inline">
            アカウントを作成する
          </Link>
        </p>
      </div>
      <div
        className={classNames(
          "absolute inset-0 transition-transform duration-[1.2s] ease-in-out",
          { "-translate-y-full": !showOverlay }
        )}
      >
        <AnonymousSelectionOverlay loading={loading.value} />
      </div>
    </div>
  );
}
