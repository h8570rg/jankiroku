"use client";

import { Modal } from "@/components/modal";
import { useMatchContext } from "../../../context";

export function ChipModalController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chipModal } = useMatchContext();

  return (
    <Modal.Backdrop
      isOpen={chipModal.isOpen}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          chipModal.open();
        } else {
          chipModal.close();
        }
      }}
    >
      <Modal.Container
        placement="bottom"
        scroll="inside"
        className="max-h-[calc(100%-2rem)]"
      >
        <Modal.Dialog>{children}</Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
