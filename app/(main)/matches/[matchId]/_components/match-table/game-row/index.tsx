"use client";

import { Card } from "@/components/card";
import { GameUpdateModal, useGameUpdateModal } from "../game-update-modal";

export function GameRow({
  index,
  children,
  matchId,
  gameId,
  style,
}: {
  index: number;
  children: React.ReactNode;
  matchId: string;
  gameId: string;
  style?: React.CSSProperties;
}) {
  const gameUpdateModal = useGameUpdateModal();
  return (
    <>
      <Card
        isPressable
        isHoverable
        className="bg-transparent shadow-none"
        onPress={gameUpdateModal.onOpen}
        style={style}
      >
        {children}
      </Card>
      <GameUpdateModal
        {...gameUpdateModal.bind}
        index={index}
        matchId={matchId}
        gameId={gameId}
      />
    </>
  );
}
