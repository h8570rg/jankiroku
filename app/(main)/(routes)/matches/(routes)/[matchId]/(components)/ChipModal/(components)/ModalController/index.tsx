"use client";

import { Modal, ModalContent } from "@/components/Modal";
import { useMatchContext } from "../../../../context";

export function ChipModalController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chipModal } = useMatchContext();

  return (
    <Modal {...chipModal.bind} hideCloseButton>
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}
