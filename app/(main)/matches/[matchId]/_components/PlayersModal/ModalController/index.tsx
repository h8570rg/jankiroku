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
    // FIXME
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal {...playersModal.bind} hideCloseButton>
      {children}
    </Modal>
  );
}
