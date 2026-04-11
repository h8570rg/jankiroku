"use client";

import { useForm } from "@conform-to/react/future";
import {
  Description,
  FieldError,
  Input,
  Modal,
  type ModalBackdropProps,
  TextField,
} from "@heroui/react";
import { useActionState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { NAME_MAX_LENGTH } from "@/lib/config";
import type { Profile } from "@/lib/type";
import { createSubmitHandler, withCallbacks } from "@/lib/utils/form";
import { createPlayer } from "./actions";
import { createPlayerSchema } from "./schema";

export function CreatePlayerModal({
  onProfileCreate,
  ...props
}: {
  onProfileCreate: (profile: Profile) => void;
} & ModalBackdropProps) {
  const [lastResult, formAction, isPending] = useActionState(
    withCallbacks(createPlayer, {
      onSuccess(result) {
        if (result.profile) {
          onProfileCreate(result.profile);
        }
        props.onOpenChange?.(false);
      },
    }),
    null,
  );
  const { form, fields } = useForm(createPlayerSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
  });

  return (
    <Modal.Backdrop {...props}>
      <Modal.Container placement="center" size="xs">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Heading>新規プレイヤー作成</Modal.Heading>
          </Modal.Header>
          <Form
            className="contents"
            validationErrors={form.fieldErrors}
            {...form.props}
          >
            <Modal.Body className="px-1 py-4">
              <TextField
                variant="secondary"
                name={fields.name.name}
                maxLength={NAME_MAX_LENGTH}
              >
                <Input placeholder="プレイヤー名を入力" />
                <Description>{`${NAME_MAX_LENGTH}文字以内で入力してください`}</Description>
                <FieldError />
              </TextField>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" slot="close">
                キャンセル
              </Button>
              <Button variant="primary" type="submit" isPending={isPending}>
                決定
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
