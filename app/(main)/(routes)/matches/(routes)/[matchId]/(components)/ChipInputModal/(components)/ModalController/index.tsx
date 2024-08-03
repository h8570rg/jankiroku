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
    <Modal {...chipInputModal.bind} hideCloseButton>
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}
