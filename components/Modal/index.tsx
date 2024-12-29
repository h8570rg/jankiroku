"use client";

import { useDisclosure } from "@nextui-org/react";

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
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
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
