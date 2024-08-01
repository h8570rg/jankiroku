"use client";

import { forwardRef } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/Modal";
import { useMatchContext } from "../../context";

export function DataModal() {
  const { isOpen, onClose } = useMatchContext().dataModal;

  return (
    <Modal size="full" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>データ</ModalHeader>
        <ModalBody>todo</ModalBody>
        {/* スペーサーとして */}
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

export const DataModalTrigger = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(function DataModalTrigger({ onClick, ...props }, ref) {
  const { onOpen } = useMatchContext().dataModal;

  return (
    <button
      ref={ref}
      onClick={(e) => {
        onOpen();
        onClick?.(e);
      }}
      {...props}
    />
  );
});
