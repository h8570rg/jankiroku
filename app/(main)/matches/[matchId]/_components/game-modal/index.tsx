"use client";

import { CircleHelp } from "lucide-react";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { Popover } from "@/components/popover";
import type { Match } from "@/lib/type";
import { GameForm } from "./form";

export type GameModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  match: Match;
};

export function GameModal({ isOpen, onOpenChange, match }: GameModalProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container
        placement="bottom"
        scroll="inside"
        className="max-h-[calc(100%-2rem)]"
      >
        <Modal.Dialog>
          <Modal.Header className="flex flex-row items-center justify-between">
            <Modal.Heading>結果入力</Modal.Heading>
            <Popover>
              <Button className="gap-1" variant="ghost" size="sm">
                <span className="text-accent underline">同点の場合</span>
                <CircleHelp className="text-accent" />
              </Button>
              <Popover.Content className="max-w-[280px] bg-surface-secondary">
                <Popover.Dialog>
                  点数が同じプレイヤーがいる場合、順番が先のプレイヤーの着順が上になります。名前の左のアイコンをドラッグ&ドロップして順番を変更できます。
                </Popover.Dialog>
              </Popover.Content>
            </Popover>
          </Modal.Header>
          <GameForm match={match} onOpenChange={onOpenChange} />
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
