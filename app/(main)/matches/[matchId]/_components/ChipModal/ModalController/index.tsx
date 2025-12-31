"use client";

import { Modal, ModalContent } from "@/components/Modal";
import { useMatchContext } from "../../../context";

export function ChipModalController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chipModal } = useMatchContext();

  return (
    <Modal
      {...chipModal.bind}
      hideCloseButton
      placement="bottom"
      scrollBehavior="inside"
      className="max-h-[calc(100%-2rem)]"
    >
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}
