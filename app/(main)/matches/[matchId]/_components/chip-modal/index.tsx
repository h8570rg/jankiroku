"use client";

import { Modal } from "@/components/modal";
import type { Match } from "@/lib/type";
import { ChipForm } from "./form";

export type ChipModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  match: Match;
};

export function ChipModal({ isOpen, onOpenChange, match }: ChipModalProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container
        placement="bottom"
        scroll="inside"
        className="max-h-[calc(100%-2rem)]"
      >
        <Modal.Dialog>
          <Modal.Header className="flex justify-between">
            <Modal.Heading>チップ入力</Modal.Heading>
          </Modal.Header>
          <ChipForm match={match} onOpenChange={onOpenChange} />
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
