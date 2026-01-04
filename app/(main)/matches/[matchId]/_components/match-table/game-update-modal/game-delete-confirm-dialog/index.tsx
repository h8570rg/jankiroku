"use client";

import { Button } from "@/components/button";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
  useModal,
} from "@/components/modal";
import { deleteGame } from "./actions";

export function GameDeleteConfirmDialog({
  matchId,
  gameId,
  ...props
}: Omit<ModalProps, "children"> & {
  matchId: string;
  gameId: string;
}) {
  return (
    <Modal {...props} hideCloseButton placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>本当に削除しますか？</ModalHeader>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                キャンセル
              </Button>
              <Button
                color="danger"
                variant="flat"
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
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export { useModal as useGameDeleteConfirmDialog };
