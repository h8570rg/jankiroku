"use client";

import { Modal } from "@/components/modal";
import { useMatchContext } from "../../../context";

export function RuleModalController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ruleModal } = useMatchContext();

  return (
    <Modal.Backdrop
      isOpen={ruleModal.isOpen}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          ruleModal.open();
        } else {
          ruleModal.close();
        }
      }}
    >
      <Modal.Container>
        <Modal.Dialog>{children}</Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
