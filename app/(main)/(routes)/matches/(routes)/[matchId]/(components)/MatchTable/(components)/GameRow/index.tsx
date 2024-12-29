"use client";

import { Card } from "@/components/Card";
import { GameUpdateModal, useGameUpdateModal } from "../GameUpdateModal";

export function GameRow({
  index,
  className,
  children,
  matchId,
  gameId,
}: {
  index: number;
  className?: string;
  children: React.ReactNode;
  matchId: string;
  gameId: string;
}) {
  const gameUpdateModal = useGameUpdateModal();
  return (
    <>
      <Card
        isPressable
        isHoverable
        className={className}
        onPress={gameUpdateModal.onOpen}
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
