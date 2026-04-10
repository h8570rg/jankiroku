"use client";

import { Modal, useOverlayState } from "@heroui/react";
import { Button } from "@/components/button";
import {
  DeleteGameConfirmDialog,
  useDeleteGameConfirmDialog,
} from "./game-delete-confirm-dialog";

export function UpdateGameModal({
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
  const deleteGameConfirmDialog = useDeleteGameConfirmDialog();
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
                onPress={deleteGameConfirmDialog.open}
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
      <DeleteGameConfirmDialog
        isOpen={deleteGameConfirmDialog.isOpen}
        onOpenChange={(isOpen) => {
          if (isOpen) {
            deleteGameConfirmDialog.open();
          } else {
            deleteGameConfirmDialog.close();
          }
        }}
        matchId={matchId}
        gameId={gameId}
      />
    </>
  );
}

export { useOverlayState as useUpdateGameModal };
