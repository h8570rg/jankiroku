"use client";

import { cn } from "@heroui/react";
import { useActionState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { TextField } from "@/components/text-field";
import { signUp } from "./actions";

/**
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export function SignUpForm({ className }: { className?: string }) {
  const [state, formAction, isPending] = useActionState(signUp, {});

  return (
    <Form
      className={cn("space-y-4 py-4", className)}
      action={formAction}
      validationErrors={state.errors}
    >
      <TextField
        type="email"
        name="email"
        autoComplete="username"
        label="メールアドレス"
      />
      <TextField
        label="パスワード"
        name="password"
        type="password"
        autoComplete="current-password"
      />
      <Button className="w-full" type="submit" isPending={isPending}>
        新規登録
      </Button>
    </Form>
  );
}
