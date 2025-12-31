"use client";

import { Modal } from "@/components/Modal";
import { useMatchContext } from "../../../context";

export function RuleModalController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ruleModal } = useMatchContext();

  return (
    <Modal {...ruleModal.bind} hideCloseButton>
      {children}
    </Modal>
  );
}
