"use client";

import { Modal, useOverlayState } from "@heroui/react";
import { useState } from "react";
import { Button } from "@/components/button";
import type { Profile } from "@/lib/type";
import { PlayerSelector } from "../../../../_components/player-selector";
import { searchProfiles, updateMatchPlayers } from "./actions";
import { CreateProfileModal } from "./create-profile-modal";

export function PlayersModalContent({
  matchId,
  friends,
  players,
  onOpenChange,
}: {
  matchId: string;
  friends: Profile[];
  players: Profile[];
  onOpenChange: (isOpen: boolean) => void;
}) {
  const [selectedPlayers, setSelectedPlayers] = useState<Profile[]>(players);

  const profileCreateModal = useOverlayState({
    defaultOpen: false,
  });

  const [isPending, setIsPending] = useState(false);

  const existingPlayerIds = players.map((p) => p.id);

  return (
    <>
      <Modal.Header>
        <Modal.Heading>プレイヤー選択</Modal.Heading>
      </Modal.Header>
      <Modal.Body className="p-1">
        <div className="flex h-[700px] max-h-[60dvh] flex-col">
          <PlayerSelector
            friends={friends}
            selectedPlayers={selectedPlayers}
            onSelectedPlayersChange={setSelectedPlayers}
            disabledPlayerIds={existingPlayerIds}
            onNewPlayerRequest={profileCreateModal.open}
            searchAction={searchProfiles}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          isPending={isPending}
          onPress={() => {
            setIsPending(true);
            updateMatchPlayers({
              matchId,
              playerIds: selectedPlayers
                .map((p) => p.id)
                .filter((p) => !players.some((p2) => p2.id === p)),
            })
              .then(() => {
                setIsPending(false);
                onOpenChange(false);
              })
              .catch((e) => {
                throw e;
              });
          }}
        >
          決定
        </Button>
      </Modal.Footer>
      <CreateProfileModal
        isOpen={profileCreateModal.isOpen}
        onClose={profileCreateModal.close}
        onProfileCreate={(profile: Profile) => {
          setSelectedPlayers((prev) => [...prev, profile]);
        }}
      />
    </>
  );
}
