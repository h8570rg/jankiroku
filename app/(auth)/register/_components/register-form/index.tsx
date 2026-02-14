"use client";

import { cn } from "@heroui/react";
import { useActionState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { TextField } from "@/components/text-field";
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

  return (
    <Form
      className={cn(className, "space-y-4")}
      action={formAction}
      validationErrors={state.errors}
    >
      <TextField
        name="displayId"
        label="ユーザーID"
        description={`半角英数字${DISPLAY_ID_MIN_LENGTH}~${DISPLAY_ID_MAX_LENGTH}文字で入力してください`}
      />
      <TextField
        name="name"
        label="名前"
        autoComplete="name"
        description={`${NAME_MAX_LENGTH}文字以内で入力してください`}
      />
      <div className="flex justify-end">
        <Button variant="primary" type="submit" isPending={isPending}>
          決定
        </Button>
      </div>
    </Form>
  );
}
