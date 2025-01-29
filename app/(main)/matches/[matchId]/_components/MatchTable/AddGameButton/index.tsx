"use client";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { useMatchContext } from "../../../context";

export function AddGameButton({ isPlayersShort }: { isPlayersShort: boolean }) {
  const { gameModal } = useMatchContext();

  function handleClick() {
    if (isPlayersShort) {
      alert("プレイヤーが足りません");
      return;
    }
    gameModal.onOpen();
  }

  return (
    <Button
      fullWidth
      size="lg"
      onPress={handleClick}
      startContent={<Icon className="size-5" name="edit" />}
      variant="ghost"
    >
      結果を入力する
    </Button>
  );
}
