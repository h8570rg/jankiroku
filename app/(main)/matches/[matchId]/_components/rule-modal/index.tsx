"use client";

import { Modal } from "@/components/modal";
import type { Rule } from "@/lib/type";
import { RuleModalContent } from "./content";

export type RuleModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  rule: Rule;
};

export function RuleModal({ isOpen, onOpenChange, rule }: RuleModalProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog>
          <RuleModalContent rule={rule} />
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
