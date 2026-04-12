"use client";

import { useForm } from "@conform-to/react/future";
import {
  cn,
  Description,
  FieldError,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";
import { useActionState, useState } from "react";
import { AvatarInput } from "@/components/avatar-input";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { NAME_MAX_LENGTH } from "@/lib/config";
import type { Profile } from "@/lib/type";
import { createSubmitHandler, withCallbacks } from "@/lib/utils/form";
import { updateProfile } from "./actions";
import { profileUpdateSchema } from "./schema";

export function ProfileForm({
  className,
  profile,
}: {
  className?: string;
  profile: Profile;
}) {
  const [lastResult, formAction, isPending] = useActionState(
    withCallbacks(updateProfile, {
      onSuccess() {
        toast.success("プロフィールを更新しました");
      },
    }),
    null,
  );
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  const { form, fields } = useForm(profileUpdateSchema, {
    lastResult,
    defaultValue: {
      name: profile.name ?? "",
      avatarUrl: profile.avatarUrl ?? undefined,
    },
    onSubmit: createSubmitHandler(formAction),
  });

  return (
    <Form
      className={cn(className, "space-y-4")}
      validationErrors={form.fieldErrors}
      {...form.props}
    >
      <div className="flex justify-center">
        <AvatarInput
          name={fields.avatarUrl.name}
          defaultValue={fields.avatarUrl.defaultValue}
          onUploadingChange={setIsAvatarUploading}
        />
      </div>
      <div className="space-y-4">
        <TextField name="displayId" isReadOnly isDisabled>
          <Label>ユーザーID</Label>
          <Input value={profile.displayId ?? ""} />
          <Description>ユーザーIDは変更できません</Description>
        </TextField>
        <TextField
          name={fields.name.name}
          defaultValue={fields.name.defaultValue}
          autoComplete="name"
        >
          <Label>名前</Label>
          <Input />
          <Description>{`${NAME_MAX_LENGTH}文字以内で入力してください`}</Description>
          <FieldError />
        </TextField>
      </div>
      <div className="flex justify-end">
        <Button
          variant="primary"
          type="submit"
          isPending={isPending}
          isDisabled={isAvatarUploading}
        >
          保存
        </Button>
      </div>
    </Form>
  );
}
