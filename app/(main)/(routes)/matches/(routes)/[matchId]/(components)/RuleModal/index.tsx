"use client";

import { forwardRef } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/Modal";
import { calcMethodLabel, chipRateLabel, rateLabel } from "@/lib/config";
import { Rule } from "@/lib/type";
import { useMatchContext } from "../../context";

export function RuleModal({ rule }: { rule: Rule }) {
  const { isOpen, onClose } = useMatchContext().ruleModal;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>ルール</ModalHeader>
        <ModalBody>
          <table className="table-fixed border-separate border-spacing-y-1">
            <tbody className="[&_td]:text-center">
              <tr>
                <th>プレイ人数</th>
                <td>{rule.playersCount}人</td>
              </tr>
              <tr>
                <th>レート</th>
                <td>{rateLabel[rule.rate]}</td>
              </tr>
              <tr>
                <th>チップ</th>
                <td>{chipRateLabel[rule.chipRate]}</td>
              </tr>
              <tr>
                <th>ウマ</th>
                <td className="space-x-4">
                  <span>{rule.incline.incline1}</span>
                  <span>{rule.incline.incline2}</span>
                  <span>{rule.incline.incline3}</span>
                  {rule.playersCount === 4 && (
                    <span>{rule.incline.incline4}</span>
                  )}
                </td>
              </tr>
              <tr>
                <th>飛び賞</th>
                <td>{rule.crackBoxBonus}点</td>
              </tr>
              <tr>
                <th>持ち点</th>
                <td>{rule.defaultPoints}点</td>
              </tr>
              <tr>
                <th>オカ</th>
                <td>{rule.defaultCalcPoints}点</td>
              </tr>
              <tr>
                <th>計算</th>
                <td>{calcMethodLabel[rule.calcMethod]}</td>
              </tr>
            </tbody>
          </table>
        </ModalBody>
        {/* スペーサーとして */}
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

export const RuleModalTrigger = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(function RuleModalTrigger({ onClick, ...props }, ref) {
  const { onOpen } = useMatchContext().ruleModal;

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
