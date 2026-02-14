"use client";

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
      <button
        type="button"
        className="bg-transparent py-1 shadow-none"
        onClick={gameUpdateModal.open}
        style={style}
      >
        {children}
      </button>
      <GameUpdateModal
        isOpen={gameUpdateModal.isOpen}
        onOpenChange={gameUpdateModal.setOpen}
        index={index}
        matchId={matchId}
        gameId={gameId}
      />
    </>
  );
}
