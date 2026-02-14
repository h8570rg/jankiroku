"use client";

import { Button } from "@/components/button";
import { Modal, useOverlayState } from "@/components/modal";
import { deleteGame } from "./actions";

export function GameDeleteConfirmDialog({
  matchId,
  gameId,
  isOpen,
  onOpenChange,
}: {
  matchId: string;
  gameId: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container placement="center">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Heading>本当に削除しますか？</Modal.Heading>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="ghost" onPress={() => onOpenChange?.(false)}>
              キャンセル
            </Button>
            <Button
              variant="danger"
              onPress={() => {
                deleteGame({
                  gameId,
                  matchId,
                }).catch((e) => {
                  throw e;
                });
              }}
            >
              削除
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

export { useOverlayState as useGameDeleteConfirmDialog };
