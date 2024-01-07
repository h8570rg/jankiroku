"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Modal } from "~/components/Modal";

export function ModalController({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isOpen = !!searchParams.get("add");

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
