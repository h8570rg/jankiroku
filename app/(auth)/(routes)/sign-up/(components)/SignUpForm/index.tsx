"use client";

import classNames from "classnames";
import { useActionState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { signUp } from "./actions";

/**
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export function SignUpForm({ className }: { className?: string }) {
  const [state, formAction, isPending] = useActionState(signUp, {});

  return (
    <form
      className={classNames("space-y-2.5 py-4", className)}
      action={formAction}
      noValidate
    >
      <Input
        id="email"
        type="email"
        name="email"
        autoComplete="username"
        required
        label="メールアドレス"
        errorMessage={state.errors?.email?.[0]}
      />
      <Input
        label="パスワード"
        id="current-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        errorMessage={state.errors?.password?.[0]}
      />
      <Button
        className="w-full"
        color="primary"
        type="submit"
        isLoading={isPending}
      >
        新規登録
      </Button>
    </form>
  );
}
