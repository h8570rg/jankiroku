"use client";

import { Modal, ModalContent } from "@/components/Modal";
import { useGameInputModal } from "../../hooks";

export function GameInputModalController({
  children,
}: {
  children: React.ReactNode;
}) {
  const gameInputModal = useGameInputModal();

  return (
    <Modal
      isOpen={gameInputModal.isOpen}
      onClose={gameInputModal.onClose}
      hideCloseButton
    >
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}
