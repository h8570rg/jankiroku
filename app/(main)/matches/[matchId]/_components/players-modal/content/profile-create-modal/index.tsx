import { useActionState } from "react";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { TextField } from "@/components/text-field";
import { NAME_MAX_LENGTH } from "@/lib/config";
import type { Profile } from "@/lib/type";
import { createProfile, type State } from "./actions";

export function ProfileCreateModal({
  isOpen,
  onClose,
  onProfileCreate,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onProfileCreate: (profile: Profile) => void;
}) {
  const [state, formAction, isPending] = useActionState(
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
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose?.();
        }
      }}
    >
      <Modal.Container placement="center" className="max-w-[80%]">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Heading>プレイヤー名入力</Modal.Heading>
          </Modal.Header>
          <form action={formAction} noValidate className="contents">
            <Modal.Body>
              <TextField
                variant="secondary"
                name="name"
                errorMessage={state.errors?.name} // TODO: errorsを渡すのか、errorを渡すのかとういつ確認
                description={`${NAME_MAX_LENGTH}文字以内で入力してください`}
                maxLength={NAME_MAX_LENGTH}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="submit" isPending={isPending}>
                決定
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
