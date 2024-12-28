import { useActionState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@/components/Modal";
import { NAME_MAX_LENGTH } from "@/lib/config";
import { Profile } from "@/lib/type";
import { State, createProfile } from "./actions";

export function ProfileCreateModal({
  isOpen,
  onClose,
  onProfileCreate,
}: Pick<ModalProps, "isOpen" | "onClose"> & {
  onProfileCreate: (profile: Profile) => void;
}) {
  const [state, formAction] = useActionState(
    async (prevState: State, formData: FormData) => {
      const result = await createProfile(prevState, formData);
      const player = result.data;
      if (player) {
        onProfileCreate(player);
        onClose?.();
      }
      return result;
    },
    {},
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      placement="center"
      classNames={{
        base: "max-w-[80%]",
      }}
    >
      <ModalContent>
        <ModalHeader>プレイヤー名入力</ModalHeader>
        <form action={formAction} noValidate>
          <ModalBody>
            <Input
              name="name"
              errorMessage={state.errors?.name}
              description={`${NAME_MAX_LENGTH}文字以内で入力してください`}
              maxLength={NAME_MAX_LENGTH}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              決定
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
