"use client";

import { Modal, ModalContent } from "@/components/Modal";
import { useMatchContext } from "../../../../context";

export function GameInputModalController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { gameInputModal } = useMatchContext();

  return (
    <Modal
      {...gameInputModal.bind}
      hideCloseButton
      placement="center" // TODO: 考える
    >
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}
