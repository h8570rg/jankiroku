import { useFormState } from "react-dom";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/Modal";
import { Profile } from "@/lib/type";
import { State, createProfile } from "./actions";

export function ProfileCreateModal({
  isOpen,
  onClose,
  onProfileCreate,
}: Pick<React.ComponentPropsWithoutRef<typeof Modal>, "isOpen" | "onClose"> & {
  onProfileCreate: (profile: Profile) => void;
}) {
  const [state, formAction] = useFormState(
    async (prevState: State, formData: FormData) => {
      const result = await createProfile(prevState, formData);
      const player = result.data;
      if (player) {
        onProfileCreate(player);
      }
      onClose();
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
            <Input name="name" errorMessage={state.errors?.name} />
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
