"use client";

import { Modal } from "@/components/modal";
import { useMatchContext } from "../../../context";

export function GameModalController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { gameModal } = useMatchContext();

  return (
    <Modal.Backdrop
      isOpen={gameModal.isOpen}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          gameModal.open();
        } else {
          gameModal.close();
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
