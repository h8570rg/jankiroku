"use client";

import { Modal } from "@/components/Modal";
import { useMatchPlayerInputModal } from "../../hooks";

export function ModalController({ children }: { children: React.ReactNode }) {
  const { onClose, isOpen } = useMatchPlayerInputModal();

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideCloseButton>
      {children}
    </Modal>
  );
}
