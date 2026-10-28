"use client";

import { useForm } from "@conform-to/react/future";
import { ErrorMessage, InputOTP, toast } from "@heroui/react";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { OTP_LENGTH, OTP_RESEND_INTERVAL_SECONDS } from "@/lib/config";
import { createSubmitHandler } from "@/lib/utils/form";
import { resendOtp, verifyOtp } from "./actions";
import { verifyOtpSchema } from "./schema";

/**
 * 6 桁そろったら自動送信する。コード不一致時はサーバーが targetValue で入力を空に戻す。
 */
export function VerifyForm({ className }: { className?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [lastResult, formAction, isPending] = useActionState(verifyOtp, null);
  const { form, fields } = useForm(verifyOtpSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
  });

  const tokenErrors = form.fieldErrors?.[fields.token.name];

  return (
    <div className={className}>
      <Form ref={formRef} validationErrors={form.fieldErrors} {...form.props}>
        <div className="mx-auto w-fit">
          <InputOTP
            aria-label="ログインコード"
            name={fields.token.name}
            maxLength={OTP_LENGTH}
            autoComplete="one-time-code"
            autoFocus
            onComplete={() => formRef.current?.requestSubmit()}
            isDisabled={isPending}
            aria-describedby={tokenErrors ? "code-error" : undefined}
            isInvalid={!!tokenErrors}
          >
            <InputOTP.Group>
              <InputOTP.Slot index={0} />
              <InputOTP.Slot index={1} />
              <InputOTP.Slot index={2} />
            </InputOTP.Group>
            <InputOTP.Separator />
            <InputOTP.Group>
              <InputOTP.Slot index={3} />
              <InputOTP.Slot index={4} />
              <InputOTP.Slot index={5} />
            </InputOTP.Group>
          </InputOTP>
          {tokenErrors && <ErrorMessage>{tokenErrors.join(" ")}</ErrorMessage>}
        </div>
        <Button className="mx-auto mt-6 block w-60" type="submit" isPending={isPending}>
          ログイン
        </Button>
      </Form>
      <ResendButton />
    </div>
  );
}

/**
 * 再送はサーバー側の送信間隔に合わせてカウントダウン後に押せるようにする。
 */
function ResendButton() {
  const [secondsLeft, setSecondsLeft] = useState(OTP_RESEND_INTERVAL_SECONDS);
  const [isResending, startResend] = useTransition();

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleResend = () => {
    startResend(async () => {
      const error = await resendOtp();
      if (error) {
        toast.danger(error);
        return;
      }
      toast.success("コードを再送しました");
      setSecondsLeft(OTP_RESEND_INTERVAL_SECONDS);
    });
  };

  return (
    <Button
      className="mx-auto mt-4 block"
      variant="outline"
      size="sm"
      onPress={handleResend}
      isDisabled={secondsLeft > 0}
      isPending={isResending}
    >
      {secondsLeft > 0 ? `コードを再送（${secondsLeft}秒後）` : "コードを再送"}
    </Button>
  );
}
