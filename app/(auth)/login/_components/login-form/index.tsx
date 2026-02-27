"use client";

import { useForm } from "@conform-to/react/future";
import { ErrorMessage } from "@heroui/react";
import { useActionState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { TextField } from "@/components/text-field";
import { createSubmitHandler } from "@/lib/utils/form";
import { signInEmail } from "./actions";
import { signInEmailSchema } from "./schema";

/**
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export function LoginForm({ className }: { className?: string }) {
  const [lastResult, formAction, isPending] = useActionState(signInEmail, null);
  const { form, fields } = useForm(signInEmailSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
  });

  return (
    <Form
      className={className}
      validationErrors={form.fieldErrors}
      {...form.props}
    >
      <div className="space-y-4">
        <TextField
          type="email"
          name={fields.email.name}
          label="メールアドレス"
          autoComplete="username"
        />
        <TextField
          type="password"
          name={fields.password.name}
          label="パスワード"
          autoComplete="current-password"
        />
      </div>
      {form.errors && <ErrorMessage>{form.errors}</ErrorMessage>}
      <Button className="mt-4 w-full" type="submit" isPending={isPending}>
        ログイン
      </Button>
    </Form>
  );
}
