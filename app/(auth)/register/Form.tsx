"use client";

import classNames from "classnames";
import { useFormState } from "react-dom";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { updateProfile } from "~/lib/actions/updateProfile";
import {
  JANRECO_ID_MAX_LENGTH,
  JANRECO_ID_MIN_LENGTH,
  NAME_MAX_LENGTH,
} from "~/lib/utils/schemas";

export function Form({
  className,
  userId,
}: {
  className?: string;
  userId: string;
}) {
  const [state, formAction] = useFormState(updateProfile, {});

  return (
    <form
      className={classNames(className, "py-4")}
      action={formAction}
      noValidate
    >
      <p className="mb-6 text-small text-foreground-light">
        ユーザーIDと名前を決めてください。
        <br />
        ユーザーIDはユーザー検索に使用されます。名前は成績表に表示されます。
      </p>
      <div className="space-y-2.5">
        <input id="id" name="id" type="text" hidden value={userId} readOnly />
        <Input
          id="janrecoId"
          type="text"
          name="janrecoId"
          required
          label="ユーザーID"
          errorMessage={state.errors?.janrecoId?.[0]}
          description={`半角英数字${JANRECO_ID_MIN_LENGTH}~${JANRECO_ID_MAX_LENGTH}文字で入力してください`}
        />
        <Input
          id="name"
          name="name"
          label="名前"
          type="text"
          autoComplete="name"
          required
          errorMessage={state.errors?.name?.[0]}
          description={`${NAME_MAX_LENGTH}文字以内で入力してください`}
        />
        <div className="flex justify-end">
          <Button className="ml-auto" color="primary" type="submit">
            決定
          </Button>
        </div>
      </div>
    </form>
  );
}
