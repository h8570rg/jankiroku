"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Modal, ModalContent } from "~/components/Modal";

export function ModalController({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const mode = searchParams.get("mode");
  const isOpen = mode === "player-add";

  const handleClose = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("mode");
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} hideCloseButton>
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}
