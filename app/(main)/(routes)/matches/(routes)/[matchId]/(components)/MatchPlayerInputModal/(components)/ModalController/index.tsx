"use client";

import { Modal, useDisclosure } from "@/components/Modal";

export function ModalController({
  children,
  defaultOpen,
}: {
  children: React.ReactNode;
  defaultOpen: boolean;
}) {
  const { onClose, isOpen } = useDisclosure({
    defaultOpen: defaultOpen,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideCloseButton>
      {children}
    </Modal>
  );
}
