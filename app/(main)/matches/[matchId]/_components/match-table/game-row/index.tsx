"use client";

import { UpdateGameModal, useUpdateGameModal } from "../update-game-modal";

export function GameRow({
  index,
  children,
  gameId,
  style,
}: {
  index: number;
  children: React.ReactNode;
  gameId: string;
  style?: React.CSSProperties;
}) {
  const updateGameModal = useUpdateGameModal();
  return (
    <>
      <button
        type="button"
        className="bg-transparent py-1 shadow-none"
        onClick={updateGameModal.open}
        style={style}
      >
        {children}
      </button>
      <UpdateGameModal
        isOpen={updateGameModal.isOpen}
        onOpenChange={updateGameModal.setOpen}
        index={index}
        gameId={gameId}
      />
    </>
  );
}
