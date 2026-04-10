"use client";

import { Modal } from "@heroui/react";
import type { Profile } from "@/lib/type";
import { PlayersModalContent } from "./players-modal-content";

export type PlayersModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  matchId: string;
  friends: Profile[];
  players: Profile[];
};

export function PlayersModal({
  isOpen,
  onOpenChange,
  matchId,
  friends,
  players,
}: PlayersModalProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog>
          <PlayersModalContent
            matchId={matchId}
            friends={friends}
            players={players}
            onOpenChange={onOpenChange}
          />
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
