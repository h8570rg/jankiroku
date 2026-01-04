"use client";

import classNames from "classnames";
import { useActionState, useId } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import {
  DISPLAY_ID_MAX_LENGTH,
  DISPLAY_ID_MIN_LENGTH,
  NAME_MAX_LENGTH,
} from "@/lib/config";
import { updateProfile } from "./actions";

export function RegisterForm({
  className,
  userId,
}: {
  className?: string;
  userId: string;
}) {
  const [state, formAction, isPending] = useActionState(
    updateProfile.bind(null, userId),
    {},
  );
  const displayIdId = useId();
  const nameId = useId();

  return (
    <form
      className={classNames(className, "space-y-2.5")}
      action={formAction}
      noValidate
    >
      <Input
        id={displayIdId}
        type="text"
        name="displayId"
        required
        label="ユーザーID"
        errorMessage={state.errors?.displayId?.[0]}
        description={`半角英数字${DISPLAY_ID_MIN_LENGTH}~${DISPLAY_ID_MAX_LENGTH}文字で入力してください`}
      />
      <Input
        id={nameId}
        name="name"
        label="名前"
        type="text"
        autoComplete="name"
        required
        errorMessage={state.errors?.name?.[0]}
        description={`${NAME_MAX_LENGTH}文字以内で入力してください`}
      />
      <div className="flex justify-end">
        <Button
          className="ml-auto"
          color="primary"
          type="submit"
          isLoading={isPending}
        >
          決定
        </Button>
      </div>
    </form>
  );
}
