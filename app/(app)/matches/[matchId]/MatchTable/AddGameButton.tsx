"use client";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { useGameInputModal } from "../useGameInputModal";

export function AddGameButton({ isDisabled }: { isDisabled: boolean }) {
  const gameInputModal = useGameInputModal();

  return (
    <Button
      fullWidth
      color="default"
      onClick={gameInputModal.onOpen}
      isDisabled={isDisabled}
      variant="ghost"
      startContent={<Icon className="size-6" name="add" />}
    >
      結果を入力する
    </Button>
  );
}
