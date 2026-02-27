"use client";

import { Modal } from "@/components/modal";
import type { Match } from "@/lib/type";
import { DataChart } from "./chart";
import { Summary } from "./summary";

export type DataModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  match: Match;
};

export function DataModal({ isOpen, onOpenChange, match }: DataModalProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container scroll="inside">
        <Modal.Dialog className="[&_.modal__body]:pb-6">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>データ</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="overflow-y-auto">
            <DataChart className="shrink-0" match={match} />
            <Summary match={match} />
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
