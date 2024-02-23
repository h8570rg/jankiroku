"use client";

import { Button } from "~/components/Button";
import { useGameInputModal } from "../useGameInputModal";

export function AddGameButton({ isDisabled }: { isDisabled: boolean }) {
  const gameInputModal = useGameInputModal();

  return (
    <Button
      fullWidth
      color="primary"
      onClick={gameInputModal.onOpen}
      isDisabled={isDisabled}
    >
      結果を入力する
    </Button>
  );
}
