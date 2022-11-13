import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import { useCallback, useState } from "react";
import Div100vh from "react-div-100vh";
import {
  useForm,
  Controller,
  SubmitHandler,
  ControllerProps,
} from "react-hook-form";
import Logo from "~/components/Logo";
import GoogleIcon from "~/lib/assets/images/g-logo.png";
import MahJong1Image from "~/lib/assets/images/mahjong1.jpeg";
import { useLoading } from "~/lib/hooks/loading";
import { Method, METHOD, signin } from "~/lib/services/auth";

const AnonymousSelectionOverlay = ({
  className,
  onSigninButtonClick,
  onAnonymousSigninButtonClick,
  loading,
}: {
  className?: string;
  onSigninButtonClick: VoidFunction;
  onAnonymousSigninButtonClick: VoidFunction;
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
          <Logo className="w-fit mx-auto mb-10" />
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

type FormInput = {
  email: string;
  password: string;
};

const rules: Record<keyof FormInput, ControllerProps["rules"]> = {
  email: {
    required: {
      value: true,
      message: "入力してください",
    },
  },
  password: {
    required: {
      value: true,
      message: "入力してください",
    },
  },
};

export default function Signin() {
  const loading = useLoading();
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FormInput>({ reValidateMode: "onSubmit" });
  const [showOverlay, setShowOverlay] = useState(true);

  const signinEmail = useCallback(
    async (email: string, password: string) => {
      const res = await signin.email(email, password);

      if (!res.success) {
        switch (res.cause) {
          case "email":
            setError("email", { type: "custom", message: res.message });
            return;
          case "password":
            setError("password", { type: "custom", message: res.message });
            return;
          case "other":
            setError("email", { type: "custom", message: res.message });
            return;
        }
      }
      Router.push("/");
    },
    [setError]
  );

  const signinSns = useCallback((method: Method) => {
    // 認証後もとのページに戻ってくるので、先にリダイレクトページに遷移してから認証
    Router.push({
      pathname: "/signin/redirect",
      query: {
        method,
      },
    });
  }, []);

  const signInAnonymous = useCallback(async () => {
    await signin.anonymous();
    Router.push("/");
  }, []);

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    async ({ email, password }) => {
      loading.wait(signinEmail(email, password));
    },
    [loading, signinEmail]
  );

  const handleGoogleSigninClick = useCallback(() => {
    signinSns(METHOD.GOOGLE);
  }, [signinSns]);

  const handleSigninButtonClick = useCallback(() => {
    setShowOverlay(false);
  }, []);

  const handleAnonymousSigninButtonClick = useCallback(() => {
    loading.wait(signInAnonymous());
  }, [loading, signInAnonymous]);

  return (
    <Div100vh className="flex items-center relative overflow-hidden">
      <div className="max-w-sm px-6 max-h-full overflow-y-auto py-10">
        <div className="font-bold mx-auto w-fit mb-10">ログイン</div>
        <div className="w-[300px] mx-auto">
          <button className="shadow" onClick={handleGoogleSigninClick}>
            <Image src={GoogleIcon} height={32} width={32} alt="google" />
          </button>
        </div>
        <div className="my-10">
          <span className="px-3">or</span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5 mx-auto">
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={rules.email}
              render={({ field }) => (
                <input {...field} type="text" autoComplete="email" />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={rules.password}
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  autoComplete="current-password"
                />
              )}
            />
            <button type="submit" className="w-full rounded-full">
              ログイン
            </button>
            <Link
              href="/signin/reset-password"
              className="w-fit ml-auto text-xs"
            >
              パスワードをお忘れの場合
            </Link>
          </div>
        </form>
        <p className="text-xs w-fit mx-auto mt-20">
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
        <AnonymousSelectionOverlay
          loading={loading.value}
          onSigninButtonClick={handleSigninButtonClick}
          onAnonymousSigninButtonClick={handleAnonymousSigninButtonClick}
        />
      </div>
    </Div100vh>
  );
}
