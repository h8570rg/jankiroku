"use client";

import { Button } from "@/components/button";
import { Modal, useOverlayState } from "@/components/modal";
import {
  GameDeleteConfirmDialog,
  useGameDeleteConfirmDialog,
} from "./game-delete-confirm-dialog";

export function GameUpdateModal({
  matchId,
  gameId,
  index,
  isOpen,
  onOpenChange,
}: {
  matchId: string;
  gameId: string;
  index: number;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  const gameDeleteConfirmDialog = useGameDeleteConfirmDialog();
  return (
    <>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>{index + 1}ゲーム目</Modal.Heading>
            </Modal.Header>
            <Modal.Footer>
              <Button
                className="mr-auto"
                variant="danger"
                onPress={gameDeleteConfirmDialog.open}
              >
                削除
              </Button>
              <Button variant="ghost" onPress={() => onOpenChange?.(false)}>
                キャンセル
              </Button>
              <Button
                type="submit"
                variant="primary"
                onPress={() => onOpenChange?.(false)}
              >
                OK
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
      <GameDeleteConfirmDialog
        isOpen={gameDeleteConfirmDialog.isOpen}
        onOpenChange={(isOpen) => {
          if (isOpen) {
            gameDeleteConfirmDialog.open();
          } else {
            gameDeleteConfirmDialog.close();
          }
        }}
        matchId={matchId}
        gameId={gameId}
      />
    </>
  );
}

export { useOverlayState as useGameUpdateModal };
