"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import {
  emailSignUpSchema,
  EmailSignUpSchema,
  useEmailSignUp,
} from "~/lib/hooks/auth";

export default function Login() {
  const { trigger: emailSignUp } = useEmailSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailSignUpSchema>({
    resolver: zodResolver(emailSignUpSchema),
  });

  const onSubmit: SubmitHandler<EmailSignUpSchema> = async (data) => {
    await emailSignUp(data);
  };

  return (
    <>
      <h1 className="mx-auto mb-2 w-fit text-lg font-bold">新規登録</h1>
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
          {...register("password")}
          errorMessage={errors.password?.message}
        />
        <Button
          isLoading={isSubmitting}
          className="w-full"
          color="primary"
          type="submit"
        >
          新規登録
        </Button>
      </form>
      <p className="text-sm">
        既にアカウントをお持ちですか？
        <Link className="link" href="/login">
          ログイン
        </Link>
      </p>
    </>
  );
}
