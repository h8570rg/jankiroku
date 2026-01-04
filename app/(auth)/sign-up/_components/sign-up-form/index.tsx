"use client";

import { cn } from "@heroui/react";
import { useActionState, useId } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { signUp } from "./actions";

/**
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export function SignUpForm({ className }: { className?: string }) {
  const [state, formAction, isPending] = useActionState(signUp, {});
  const emailId = useId();
  const passwordId = useId();

  return (
    <form
      className={cn("space-y-2.5 py-4", className)}
      action={formAction}
      noValidate
    >
      <Input
        id={emailId}
        type="email"
        name="email"
        autoComplete="username"
        required
        label="メールアドレス"
        errorMessage={state.errors?.email?.[0]}
      />
      <Input
        label="パスワード"
        id={passwordId}
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
