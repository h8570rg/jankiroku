"use client";

import { Modal, ModalContent } from "@/components/Modal";
import { useMatchPlayerInputModal } from "../../hooks";

export function ModalController({ children }: { children: React.ReactNode }) {
  const { onClose, isOpen } = useMatchPlayerInputModal();

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideCloseButton>
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}
