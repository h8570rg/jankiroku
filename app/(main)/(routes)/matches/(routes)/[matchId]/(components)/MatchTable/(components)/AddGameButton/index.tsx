"use client";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { useGameInputModal } from "../../../GameInputModal/hooks";

export function AddGameButton({ isPlayersShort }: { isPlayersShort: boolean }) {
  const gameInputModal = useGameInputModal();

  function handleClick() {
    if (isPlayersShort) {
      alert("プレイヤーが足りません");
      return;
    }
    gameInputModal.onOpen();
  }

  return (
    <Button
      fullWidth
      size="lg"
      onClick={handleClick}
      startContent={<Icon className="size-5" name="edit" />}
      variant="ghost"
    >
      結果を入力する
    </Button>
  );
}
