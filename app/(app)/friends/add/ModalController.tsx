"use client";

import { useRouter } from "next/navigation";
import { Modal } from "~/components/Modal";

export function ModalController({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        router.push("/friends");
      }}
      hideCloseButton
    >
      {children}
    </Modal>
  );
}
