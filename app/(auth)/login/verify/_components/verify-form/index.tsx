"use client";

import { useForm } from "@conform-to/react/future";
import { cn, ErrorMessage, InputOTP, toast } from "@heroui/react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { OTP_LENGTH, OTP_RESEND_INTERVAL_SECONDS } from "@/lib/config";
import { createSubmitHandler } from "@/lib/utils/form";
import { Captcha } from "../../../_components/captcha";
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
    <div className={cn("flex flex-col items-center", className)}>
      <Form
        ref={formRef}
        className="flex flex-col items-center"
        validationErrors={form.fieldErrors}
        {...form.props}
      >
        <div>
          <InputOTP
            aria-label="ログインコード"
            name={fields.token.name}
            maxLength={OTP_LENGTH}
            autoComplete="one-time-code"
            autoFocus
            onComplete={() => formRef.current?.requestSubmit()}
            isDisabled={isPending}
            aria-describedby={tokenErrors ? fields.token.errorId : undefined}
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
          {tokenErrors && (
            <ErrorMessage id={fields.token.errorId}>{tokenErrors.join(" ")}</ErrorMessage>
          )}
        </div>
        <Button className="mt-6 w-60" type="submit" isPending={isPending}>
          ログイン
        </Button>
      </Form>
      <ResendButton />
    </div>
  );
}

/**
 * 再送はサーバー側の送信間隔に合わせてカウントダウン後に押せるようにする。
 * 再送にも CAPTCHA のトークンが要る。ログインと同じく、トークンを待たずにその時点のものを送る。
 */
function ResendButton() {
  const [secondsLeft, setSecondsLeft] = useState(OTP_RESEND_INTERVAL_SECONDS);
  const [isPending, startTransition] = useTransition();
  const captchaRef = useRef<TurnstileInstance>(undefined);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleResend = () => {
    startTransition(async () => {
      const error = await resendOtp(captchaRef.current?.getResponse());
      captchaRef.current?.reset();
      if (error) {
        toast.danger(error);
        return;
      }
      toast.success("コードを再送しました");
      setSecondsLeft(OTP_RESEND_INTERVAL_SECONDS);
    });
  };

  return (
    // 余白の付け方は login-form と同じ。親の flex の中ではマージンが重ならないので、ブロックの div で包む
    <div>
      <Captcha ref={captchaRef} className="my-4" />
      <Button
        className="mx-auto mt-4 flex"
        variant="outline"
        size="sm"
        onPress={handleResend}
        isDisabled={secondsLeft > 0}
        isPending={isPending}
      >
        {secondsLeft > 0 ? `コードを再送（${secondsLeft}秒後）` : "コードを再送"}
      </Button>
    </div>
  );
}
