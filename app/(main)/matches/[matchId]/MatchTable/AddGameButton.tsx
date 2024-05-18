"use client";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { useGameInputModal } from "../useGameInputModal";

export function AddGameButton({ isDisabled }: { isDisabled: boolean }) {
  const gameInputModal = useGameInputModal();

  return (
    <Button
      fullWidth
      onClick={gameInputModal.onOpen}
      isDisabled={isDisabled}
      startContent={<Icon className="size-6" name="add" />}
      variant="ghost"
    >
      結果を入力する
    </Button>
  );
}
