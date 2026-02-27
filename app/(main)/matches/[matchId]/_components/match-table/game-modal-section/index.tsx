"use client";

import { Button, type ButtonProps } from "@/components/button";
import { useOverlayState } from "@/components/modal";
import type { Match } from "@/lib/type";
import { GameModal } from "../../game-modal";

export function GameModalSection({
  match,
  isPlayersShort,
  children,
  ...buttonProps
}: {
  match: Match;
  isPlayersShort: boolean;
  children: React.ReactNode;
} & ButtonProps) {
  const gameModal = useOverlayState();

  return (
    <>
      <Button
        {...buttonProps}
        onPress={() => {
          if (isPlayersShort) {
            alert("プレイヤーが足りません");
            return;
          }
          gameModal.open();
        }}
      >
        {children}
      </Button>
      <GameModal
        isOpen={gameModal.isOpen}
        onOpenChange={gameModal.setOpen}
        match={match}
      />
    </>
  );
}
