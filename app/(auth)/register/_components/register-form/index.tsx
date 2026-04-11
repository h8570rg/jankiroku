"use client";

import { useForm } from "@conform-to/react/future";
import {
  cn,
  Description,
  ErrorMessage,
  FieldError,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { useActionState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import {
  DISPLAY_ID_MAX_LENGTH,
  DISPLAY_ID_MIN_LENGTH,
  NAME_MAX_LENGTH,
} from "@/lib/config";
import { createSubmitHandler } from "@/lib/utils/form";
import { updateProfile } from "./actions";
import { updateProfileSchema } from "./schema";

export function RegisterForm({
  className,
  userId,
}: {
  className?: string;
  userId: string;
}) {
  const [lastResult, formAction, isPending] = useActionState(
    updateProfile,
    null,
  );
  const { form, fields } = useForm(updateProfileSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
  });

  return (
    <Form
      className={cn(className, "space-y-4")}
      validationErrors={form.fieldErrors}
      {...form.props}
    >
      <input type="hidden" name="userId" value={userId} />
      <div className="space-y-4">
        <TextField name={fields.displayId.name}>
          <Label>ユーザーID</Label>
          <Input />
          <Description>{`半角英数字${DISPLAY_ID_MIN_LENGTH}~${DISPLAY_ID_MAX_LENGTH}文字で入力してください`}</Description>
          <FieldError />
        </TextField>
        <TextField name={fields.name.name} autoComplete="name">
          <Label>名前</Label>
          <Input />
          <Description>{`${NAME_MAX_LENGTH}文字以内で入力してください`}</Description>
          <FieldError />
        </TextField>
      </div>
      {form.errors && <ErrorMessage>{form.errors}</ErrorMessage>}
      <div className="flex justify-end">
        <Button variant="primary" type="submit" isPending={isPending}>
          決定
        </Button>
      </div>
    </Form>
  );
}
