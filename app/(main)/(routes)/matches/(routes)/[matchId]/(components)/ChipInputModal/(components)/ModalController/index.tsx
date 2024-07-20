"use client";

import { Modal, ModalContent } from "@/components/Modal";
import { useMatchContext } from "../../../../context";

export function ChipInputModalController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chipInputModal } = useMatchContext();

  return (
    <Modal
      isOpen={chipInputModal.isOpen}
      onClose={chipInputModal.onClose}
      hideCloseButton
    >
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}
