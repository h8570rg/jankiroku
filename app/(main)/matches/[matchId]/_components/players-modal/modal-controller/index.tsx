"use client";

import { useEffect } from "react";
import { Modal } from "@/components/modal";
import { useMatchContext } from "../../../context";

export function PlayersModalController({
  children,
  isDefaultOpen,
}: {
  children: React.ReactNode;
  isDefaultOpen?: boolean;
}) {
  const { playersModal } = useMatchContext();

  useEffect(() => {
    if (isDefaultOpen) {
      playersModal.open();
    }
  }, [isDefaultOpen, playersModal]);

  return (
    <Modal.Backdrop
      isOpen={playersModal.isOpen}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          playersModal.open();
        } else {
          playersModal.close();
        }
      }}
    >
      <Modal.Container>
        <Modal.Dialog>{children}</Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
