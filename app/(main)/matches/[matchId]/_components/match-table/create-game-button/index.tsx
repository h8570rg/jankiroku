"use client";

import { useOverlayState } from "@heroui/react";
import { Pencil } from "lucide-react";
import { Button, type ButtonProps } from "@/components/button";
import type { Match } from "@/lib/type";
import { CreateGameDrawer } from "../../create-game-drawer";

export function CreateGameButton({
  match,
  isPlayersShort,
  ...buttonProps
}: {
  match: Match;
  isPlayersShort: boolean;
} & ButtonProps) {
  const gameDrawer = useOverlayState();

  return (
    <>
      <Button
        size="lg"
        variant="outline"
        onPress={() => {
          if (isPlayersShort) {
            alert("プレイヤーが足りません");
            return;
          }
          gameDrawer.open();
        }}
        {...buttonProps}
      >
        <Pencil />
        結果を入力する
      </Button>
      <CreateGameDrawer
        isOpen={gameDrawer.isOpen}
        onOpenChange={gameDrawer.setOpen}
        match={match}
      />
    </>
  );
}
