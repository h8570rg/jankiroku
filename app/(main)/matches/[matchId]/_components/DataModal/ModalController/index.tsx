"use client";

import { Modal, ModalContent } from "@/components/Modal";
import { useMatchContext } from "../../../context";

export function DataModalController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dataModal } = useMatchContext();

  return (
    <Modal
      {...dataModal.bind}
      scrollBehavior="inside"
      classNames={{
        body: "pb-6",
      }}
    >
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}
