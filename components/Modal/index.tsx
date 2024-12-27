"use client";

import { uniqueId } from "lodash-es";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

export type { ModalProps } from "@nextui-org/react";
export {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

export type UseModalReturn = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  bind: {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
  };
};

export const useModal = (): UseModalReturn => {
  const key = useRef(uniqueId("modal")).current;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isOpen = searchParams.get(key) === "true";

  const onOpen = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set(key, "true");
    router.push(`${pathname}?${params.toString()}`);
  }, [key, pathname, router, searchParams]);

  const onClose = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }, [key, pathname, router, searchParams]);

  const onOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        onOpen();
      } else {
        onClose();
      }
    },
    [onClose, onOpen],
  );

  return {
    isOpen,
    onOpen,
    onClose,
    bind: {
      isOpen,
      onOpenChange,
    },
  };
};
