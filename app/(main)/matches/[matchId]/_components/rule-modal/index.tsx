"use client";

import { Modal, Separator } from "@heroui/react";
import { calcMethodLabel, rateLabel } from "@/lib/config";
import type { Rule } from "@/lib/type";

export type RuleModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  rule: Rule;
};

type RuleItem = {
  label: string;
  value: React.ReactNode;
};

export function RuleModal({ isOpen, onOpenChange, rule }: RuleModalProps) {
  const items: RuleItem[] = [
    { label: "プレイ人数", value: `${rule.playersCount}人` },
    { label: "レート", value: rateLabel[rule.rate] },
    { label: "チップ", value: `${rule.chipRate}円` },
    {
      label: "ウマ",
      value: (
        <span className="space-x-3">
          <span>{rule.incline.incline1}</span>
          <span>{rule.incline.incline2}</span>
          <span>{rule.incline.incline3}</span>
          {rule.playersCount === 4 && <span>{rule.incline.incline4}</span>}
        </span>
      ),
    },
    { label: "飛び賞", value: `${rule.crackBoxBonus}点` },
    { label: "持ち点", value: `${rule.defaultPoints}点` },
    { label: "オカ", value: `${rule.defaultCalcPoints}点` },
    { label: "計算", value: calcMethodLabel[rule.calcMethod] },
  ];

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container placement="center">
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>ルール</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <dl>
              {items.map(({ label, value }, i) => (
                <div key={label}>
                  {i > 0 && <Separator />}
                  <div className="flex justify-between py-2">
                    <dt className="text-muted">{label}</dt>
                    <dd>{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Modal.Body>
          <Modal.Footer />
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
