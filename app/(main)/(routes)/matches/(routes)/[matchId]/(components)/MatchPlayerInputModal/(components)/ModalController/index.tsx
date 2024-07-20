"use client";

import { Modal } from "@/components/Modal";
import { useMatchContext } from "../../../../context";

export function ModalController({ children }: { children: React.ReactNode }) {
  const { onClose, isOpen } = useMatchContext().playerInputModal;

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideCloseButton>
      {children}
    </Modal>
  );
}
