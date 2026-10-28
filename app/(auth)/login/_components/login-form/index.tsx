"use client";

import { useForm } from "@conform-to/react/future";
import { FieldError, InputGroup, Label, TextField } from "@heroui/react";
import { Mail } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { createSubmitHandler } from "@/lib/utils/form";
import { requestOtp } from "./actions";
import { requestOtpSchema } from "./schema";

/**
 * メールアドレスを送信してコード入力画面（/login/verify）へ進む。
 */
export function LoginForm({ className }: { className?: string }) {
  const [lastResult, formAction, isPending] = useActionState(requestOtp, null);
  const { form, fields } = useForm(requestOtpSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
  });

  return (
    <Form className={className} validationErrors={form.fieldErrors} {...form.props}>
      <TextField type="text" inputMode="email" name={fields.email.name} autoComplete="email">
        <Label>メールアドレス</Label>
        <InputGroup>
          <InputGroup.Prefix>
            <Mail className="size-4 text-muted" />
          </InputGroup.Prefix>
          <InputGroup.Input placeholder="name@email.com" />
        </InputGroup>
        <FieldError />
      </TextField>
      <Button className="mt-4 w-full" type="submit" isPending={isPending}>
        ログインコードを送信
      </Button>
    </Form>
  );
}
