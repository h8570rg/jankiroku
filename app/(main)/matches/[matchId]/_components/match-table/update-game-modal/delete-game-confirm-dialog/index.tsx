"use client";

import { Modal, useOverlayState } from "@heroui/react";
import { useTransition } from "react";
import { Button } from "@/components/button";
import { deleteGame } from "./actions";

export function DeleteGameConfirmDialog({
  gameId,
  isOpen,
  onOpenChange,
}: {
  gameId: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  const [isPending, startTransition] = useTransition();

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
              isPending={isPending}
              onPress={() => {
                startTransition(async () => {
                  await deleteGame({ gameId });
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

export { useOverlayState as useDeleteGameConfirmDialog };
