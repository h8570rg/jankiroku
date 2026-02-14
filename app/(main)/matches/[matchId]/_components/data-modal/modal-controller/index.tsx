"use client";

import { Modal } from "@/components/modal";
import { useMatchContext } from "../../../context";

export function DataModalController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dataModal } = useMatchContext();

  return (
    <Modal.Backdrop
      isOpen={dataModal.isOpen}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          dataModal.open();
        } else {
          dataModal.close();
        }
      }}
    >
      <Modal.Container scroll="inside">
        <Modal.Dialog className="[&_.modal__body]:pb-6">
          <Modal.CloseTrigger />
          {children}
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
