"use client";

import { useForm } from "@conform-to/react/future";
import { FieldError, InputGroup, Label, TextField, Typography } from "@heroui/react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { Mail } from "lucide-react";
import { useActionState, useRef } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { createSubmitHandler } from "@/lib/utils/form";
import { Captcha } from "../captcha";
import { requestOtp } from "./actions";
import { requestOtpSchema } from "./schema";

/**
 * メールアドレスを送信してコード入力画面（/login/verify）へ進む。
 */
export function LoginForm({ className }: { className?: string }) {
  const [lastResult, formAction, isPending] = useActionState(requestOtp, null);
  const captchaRef = useRef<TurnstileInstance>(undefined);
  const submit = createSubmitHandler(formAction);
  const { form, fields } = useForm(requestOtpSchema, {
    lastResult,
    onSubmit: (event, context) => {
      submit(event, context);
      // トークンは 1 回しか使えない。送信に失敗して画面に残ったときのために、すぐ取り直しておく
      captchaRef.current?.reset();
    },
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
      {/*
        CAPTCHA は隠れている間も高さ 0 の枠が残る。上下のマージンをボタンのマージンと重ねて（マージンの相殺）、
        見えているときだけ余白が付くようにする。Button は inline-flex だとマージンが重ならないので flex にする
      */}
      <Captcha ref={captchaRef} className="my-4" />
      <Button className="mt-4 flex w-full" type="submit" isPending={isPending}>
        ログインコードを送信
      </Button>
      {/* パスワード認証の廃止に伴う既存ユーザー向けの案内。移行が落ち着いたら削除する */}
      <Typography type="body-xs" align="center" color="muted" className="mt-4">
        パスワードでのログインは終了しました。
        <br />
        メールアドレスを入力すると、6桁のログインコードが届きます。
      </Typography>
    </Form>
  );
}
