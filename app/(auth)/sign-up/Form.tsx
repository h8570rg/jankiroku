"use client";

import classNames from "classnames";
import { useFormState } from "react-dom";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { signUp } from "~/lib/actions/signUp";

export function Form({ className }: { className?: string }) {
  const [state, formAction] = useFormState(signUp, {});

  return (
    <form
      className={classNames("space-y-2.5 py-4", className)}
      action={formAction}
      noValidate
    >
      <Input
        id="email"
        type="email"
        name="email"
        autoComplete="username"
        required
        label="メールアドレス"
        errorMessage={state.errors?.email?.[0]}
      />
      <Input
        label="パスワード"
        id="current-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        errorMessage={state.errors?.password?.[0]}
      />
      <Button className="w-full" color="primary" type="submit">
        新規登録
      </Button>
    </form>
  );
}
