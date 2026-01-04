"use client";

import { Modal, ModalContent } from "@/components/modal";
import { useMatchContext } from "../../../context";

export function GameModalController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { gameModal } = useMatchContext();

  return (
    <Modal
      {...gameModal.bind}
      hideCloseButton
      placement="bottom"
      scrollBehavior="inside"
      className="max-h-[calc(100%-2rem)]"
    >
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}
