"use client";

import { useForm } from "@conform-to/react/future";
import {
  Description,
  ErrorMessage,
  FieldError,
  Input,
  InputOTP,
  Label,
  linkVariants,
  REGEXP_ONLY_DIGITS,
  TextField,
  Typography,
} from "@heroui/react";
import { useActionState, useState, useTransition } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { OTP_LENGTH } from "@/lib/config";
import { createSubmitHandler, withCallbacks } from "@/lib/utils/form";
import { requestOtp, resendOtp, verifyOtp } from "./actions";
import { requestOtpSchema, verifyOtpSchema } from "./schema";

/**
 * メールアドレス入力 → ワンタイムコード入力の 2 段階でログインする。
 */
export function LoginForm({ className }: { className?: string }) {
  const [email, setEmail] = useState<string | null>(null);

  if (email === null) {
    return <EmailStep className={className} onSent={setEmail} />;
  }
  return <CodeStep className={className} email={email} onBack={() => setEmail(null)} />;
}

function EmailStep({ className, onSent }: { className?: string; onSent: (email: string) => void }) {
  const [lastResult, formAction, isPending] = useActionState(
    withCallbacks(requestOtp, {
      onSuccess: (result) => {
        if ("email" in result) onSent(result.email);
      },
    }),
    null,
  );
  const { form, fields } = useForm(requestOtpSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
  });

  return (
    <Form className={className} validationErrors={form.fieldErrors} {...form.props}>
      <TextField type="text" inputMode="email" name={fields.email.name} autoComplete="email">
        <Label>メールアドレス</Label>
        <Input />
        <FieldError />
      </TextField>
      {form.errors && <ErrorMessage>{form.errors}</ErrorMessage>}
      <Button className="mt-4 w-full" type="submit" isPending={isPending}>
        ログインコードを送信
      </Button>
    </Form>
  );
}

function CodeStep({
  className,
  email,
  onBack,
}: {
  className?: string;
  email: string;
  onBack: () => void;
}) {
  const [lastResult, formAction, isPending] = useActionState(verifyOtp, null);
  const { form, fields } = useForm(verifyOtpSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
  });
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [isResending, startResend] = useTransition();

  const handleResend = () => {
    startResend(async () => {
      const error = await resendOtp(email);
      setResendMessage(error ?? "コードを再送しました。");
    });
  };

  const tokenErrors = form.fieldErrors?.[fields.token.name];

  return (
    <Form className={className} validationErrors={form.fieldErrors} {...form.props}>
      <input type="hidden" name={fields.email.name} value={email} />
      <div className="flex flex-col gap-2">
        <Label>ログインコード</Label>
        <Description>
          {email} に届いた{OTP_LENGTH}桁のコードを入力してください。
        </Description>
        <InputOTP
          aria-label="ログインコード"
          name={fields.token.name}
          maxLength={OTP_LENGTH}
          pattern={REGEXP_ONLY_DIGITS}
          autoComplete="one-time-code"
          autoFocus
          isInvalid={!!tokenErrors || !!form.errors}
        >
          <InputOTP.Group>
            {Array.from({ length: OTP_LENGTH }, (_, index) => (
              // oxlint-disable-next-line react/no-array-index-key -- slots are fixed positions
              <InputOTP.Slot key={index} index={index} />
            ))}
          </InputOTP.Group>
        </InputOTP>
        {tokenErrors && <ErrorMessage>{tokenErrors}</ErrorMessage>}
      </div>
      {form.errors && <ErrorMessage>{form.errors}</ErrorMessage>}
      <Button className="mt-4 w-full" type="submit" isPending={isPending}>
        ログイン
      </Button>
      <div className="mt-4 flex justify-center gap-4">
        <button
          className={linkVariants().base()}
          type="button"
          onClick={handleResend}
          disabled={isResending}
        >
          コードを再送
        </button>
        <button className={linkVariants().base()} type="button" onClick={onBack}>
          メールアドレスを変更
        </button>
      </div>
      {resendMessage && (
        <Typography type="body-sm" align="center" color="muted" className="mt-2">
          {resendMessage}
        </Typography>
      )}
    </Form>
  );
}
