"use client";

import { Modal, ModalContent } from "@/components/Modal";
import { useChipInputModal } from "../useChipInputModal";

export function ModalController({ children }: { children: React.ReactNode }) {
  const chipInputModal = useChipInputModal();

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
