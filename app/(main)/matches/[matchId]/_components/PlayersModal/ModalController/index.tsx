"use client";

import { useEffect } from "react";
import { Modal } from "@/components/Modal";
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
      playersModal.onOpen();
    }
  }, [isDefaultOpen, playersModal.onOpen]);

  return (
    <Modal {...playersModal.bind} hideCloseButton>
      {children}
    </Modal>
  );
}
