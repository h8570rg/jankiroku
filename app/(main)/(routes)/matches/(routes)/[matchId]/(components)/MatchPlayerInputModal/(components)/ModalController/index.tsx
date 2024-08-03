"use client";

import { useEffect } from "react";
import { Modal } from "@/components/Modal";
import { useMatchContext } from "../../../../context";

export function ModalController({
  children,
  isDefaultOpen,
}: {
  children: React.ReactNode;
  isDefaultOpen?: boolean;
}) {
  const { playerInputModal } = useMatchContext();

  useEffect(() => {
    if (isDefaultOpen) {
      playerInputModal.onOpen();
    }
    // FIXME
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal {...playerInputModal.bind} hideCloseButton>
      {children}
    </Modal>
  );
}
