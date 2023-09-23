"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/Button";
import { Divider } from "~/components/Divider";
import { Input } from "~/components/Input";
import { GoogleIcon } from "~/components/SocialProviderIcon";
import {
  useEmailSignIn,
  emailSignInSchema,
  EmailSignInSchema,
  useGoogleSignIn,
} from "~/lib/hooks/auth";

export default function Login() {
  const { trigger: emailSignIn } = useEmailSignIn();
  const { trigger: googleSignIn } = useGoogleSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailSignInSchema>({
    resolver: zodResolver(emailSignInSchema),
  });

  const onSubmit: SubmitHandler<EmailSignInSchema> = async (data) => {
    await emailSignIn(data);
  };

  const handleGoogleSignInClick = async () => {
    await googleSignIn();
  };

  return (
    <>
      <h1 className="mx-auto mb-2 w-fit text-lg font-bold">ログイン</h1>
      <ul className="flex py-4">
        <SocialProviderItem
          label="Google でログイン"
          onClick={handleGoogleSignInClick}
        >
          <GoogleIcon className="w-full" />
        </SocialProviderItem>
      </ul>
      <div className="flex items-center gap-4">
        <Divider className="shrink" />
        <span>or</span>
        <Divider className="shrink" />
      </div>
      <form className="space-y-2.5 py-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          required
          label="メールアドレス"
          {...register("email")}
          errorMessage={errors.email?.message}
        />
        <Input
          label="パスワード"
          id="current-password"
          type="password"
          autoComplete="current-password"
          required
          errorMessage={errors.password?.message}
          {...register("password")}
        />
        <Button
          isLoading={isSubmitting}
          className="w-full"
          color="primary"
          type="submit"
        >
          ログイン
        </Button>
      </form>
      <p className="text-sm">
        アカウントをお持ちでないですか？
        <Link className="link" href="/sign-up">
          新規登録
        </Link>
      </p>
    </>
  );
}

function SocialProviderItem({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: VoidFunction;
}) {
  return (
    <li className="w-full">
      <Button
        className="flex w-full items-center justify-center gap-3 bg-default-100"
        size="lg"
        radius="md"
        onClick={onClick}
      >
        <span className="w-5">{children}</span>
        <span>{label}</span>
      </Button>
    </li>
  );
}
