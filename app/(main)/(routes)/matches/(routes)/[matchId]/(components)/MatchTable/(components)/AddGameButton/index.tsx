"use client";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { useGameInputModal } from "../../../GameInputModal/hooks";

export function AddGameButton({ isDisabled }: { isDisabled: boolean }) {
  const gameInputModal = useGameInputModal();

  return (
    <Button
      fullWidth
      size="lg"
      onClick={gameInputModal.onOpen}
      isDisabled={isDisabled}
      startContent={<Icon className="size-5" name="edit" />}
      variant="ghost"
    >
      結果を入力する
    </Button>
  );
}
