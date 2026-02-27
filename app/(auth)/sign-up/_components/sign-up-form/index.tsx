"use client";

import { useForm } from "@conform-to/react/future";
import { cn, ErrorMessage } from "@heroui/react";
import { useActionState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { TextField } from "@/components/text-field";
import { createSubmitHandler } from "@/lib/utils/form";
import { signUp } from "./actions";
import { signUpSchema } from "./schema";

/**
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export function SignUpForm({ className }: { className?: string }) {
  const [lastResult, formAction, isPending] = useActionState(signUp, null);
  const { form, fields } = useForm(signUpSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
  });

  return (
    <Form
      className={cn("space-y-4 py-4", className)}
      validationErrors={form.fieldErrors}
      {...form.props}
    >
      <div>
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
      </div>
      <Button className="w-full" type="submit" isPending={isPending}>
        新規登録
      </Button>
    </Form>
  );
}
