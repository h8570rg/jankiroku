"use client";

import { useOverlayState } from "@/components/modal";
import type { Profile } from "@/lib/type";
import { PlayersModal } from "../../players-modal";

export function PlayersRow({
  className,
  style,
  children,
  matchId,
  friends,
  players,
  isDefaultOpen,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  matchId: string;
  friends: Profile[];
  players: Profile[];
  isDefaultOpen?: boolean;
}) {
  const playersModal = useOverlayState({ defaultOpen: isDefaultOpen ?? false });

  return (
    <>
      <button
        type="button"
        className={className}
        style={style}
        onClick={playersModal.open}
      >
        {children}
      </button>
      <PlayersModal
        isOpen={playersModal.isOpen}
        onOpenChange={playersModal.setOpen}
        matchId={matchId}
        friends={friends}
        players={players}
      />
    </>
  );
}
