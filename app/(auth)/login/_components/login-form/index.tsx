"use client";

import { ErrorMessage } from "@heroui/react";
import { useActionState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { TextField } from "@/components/text-field";
import { signInEmail } from "./actions";

/**
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export function LoginForm({ className }: { className?: string }) {
  const [state, formAction, isPending] = useActionState(signInEmail, {});

  return (
    <Form
      className={className}
      action={formAction}
      validationErrors={state.errors}
    >
      <div className="space-y-4">
        <TextField
          type="email"
          name="email"
          autoComplete="username"
          label="メールアドレス"
        />
        <TextField
          name="password"
          label="パスワード"
          type="password"
          autoComplete="current-password"
        />
      </div>
      <ErrorMessage>{state.errors?.base}</ErrorMessage>
      <Button className="mt-4 w-full" type="submit" isPending={isPending}>
        ログイン
      </Button>
    </Form>
  );
}
