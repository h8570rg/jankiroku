"use client";

import { useForm } from "@conform-to/react/future";
import { useActionState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { Modal } from "@/components/modal";
import { TextField } from "@/components/text-field";
import { NAME_MAX_LENGTH } from "@/lib/config";
import type { Profile } from "@/lib/type";
import { createSubmitHandler, withCallbacks } from "@/lib/utils/form";
import { createProfile } from "./actions";
import { createProfileSchema } from "./schema";

export function ProfileCreateModal({
  isOpen,
  onClose,
  onProfileCreate,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onProfileCreate: (profile: Profile) => void;
}) {
  const [lastResult, formAction, isPending] = useActionState(
    withCallbacks(createProfile, {
      onSuccess(result) {
        const raw = (result as { targetValue?: { data?: string } })?.targetValue
          ?.data;
        if (typeof raw === "string") {
          try {
            const profile = JSON.parse(raw) as Profile;
            onProfileCreate(profile);
          } catch {
            // ignore
          }
        }
        onClose?.();
      },
    }),
    null,
  );
  const { form, fields } = useForm(createProfileSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
  });

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose?.();
      }}
    >
      <Modal.Container placement="center" className="max-w-[80%]">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Heading>プレイヤー名入力</Modal.Heading>
          </Modal.Header>
          <Form
            className="contents"
            validationErrors={form.fieldErrors}
            {...form.props}
          >
            <Modal.Body>
              <TextField
                variant="secondary"
                name={fields.name.name}
                description={`${NAME_MAX_LENGTH}文字以内で入力してください`}
                maxLength={NAME_MAX_LENGTH}
              />
            </Modal.Body>
            <Modal.Footer>
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
