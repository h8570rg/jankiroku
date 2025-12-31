"use client";

import { Button } from "@/components/Button";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
  useModal,
} from "@/components/Modal";
import {
  GameDeleteConfirmDialog,
  useGameDeleteConfirmDialog,
} from "./GameDeleteConfirmDialog";

export function GameUpdateModal({
  matchId,
  gameId,
  index,
  ...props
}: Omit<ModalProps, "children"> & {
  matchId: string;
  gameId: string;
  index: number;
}) {
  const gameDeleteConfirmDialog = useGameDeleteConfirmDialog();
  return (
    <>
      <Modal {...props} hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{index + 1}ゲーム目</ModalHeader>
              <ModalFooter>
                <Button
                  className="mr-auto"
                  color="danger"
                  variant="flat"
                  onPress={gameDeleteConfirmDialog.onOpen}
                >
                  削除
                </Button>
                <Button variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button type="submit" color="primary" onPress={onClose}>
                  OK
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <GameDeleteConfirmDialog
        {...gameDeleteConfirmDialog.bind}
        matchId={matchId}
        gameId={gameId}
      />
    </>
  );
}

export { useModal as useGameUpdateModal };
