"use client";

import { Modal, ModalContent } from "@/components/Modal";
import { useMatchContext } from "../../../../context";

export function GameModalController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { gameModal } = useMatchContext();

  return (
    <Modal
      {...gameModal.bind}
      hideCloseButton
      placement="bottom" // TODO: 考える
    >
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}
