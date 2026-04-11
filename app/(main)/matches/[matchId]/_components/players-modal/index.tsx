"use client";

import { Modal, useOverlayState } from "@heroui/react";
import { useActionState, useState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import type { Profile } from "@/lib/type";
import { createSubmitHandler, withCallbacks } from "@/lib/utils/form";
import { PlayerSelector } from "../../../_components/player-selector";
import { CreatePlayerModal } from "../../../_components/player-selector/create-player-modal";
import { searchProfiles, updateMatchPlayers } from "./actions";

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
  const [selectedPlayers, setSelectedPlayers] = useState<Profile[]>(players);
  const profileCreateModal = useOverlayState({ defaultOpen: false });

  const existingPlayerIds = players.map((p) => p.id);

  const [lastResult, formAction, isPending] = useActionState(
    withCallbacks(updateMatchPlayers.bind(null, matchId, existingPlayerIds), {
      onSuccess() {
        onOpenChange(false);
      },
    }),
    null,
  );

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Heading>プレイヤー選択</Modal.Heading>
          </Modal.Header>
          <Form className="contents" onSubmit={createSubmitHandler(formAction)}>
            <Modal.Body className="p-1">
              <div className="flex h-[700px] max-h-[60dvh] flex-col">
                {selectedPlayers.map((p) => (
                  <input
                    key={p.id}
                    type="hidden"
                    name="playerIds"
                    value={p.id}
                  />
                ))}
                <PlayerSelector
                  friends={friends}
                  selectedPlayers={selectedPlayers}
                  onSelectedPlayersChange={setSelectedPlayers}
                  disabledPlayerIds={existingPlayerIds}
                  onNewPlayerRequest={profileCreateModal.open}
                  searchAction={searchProfiles}
                  error={lastResult?.error?.fieldErrors?.playerIds}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="submit" isPending={isPending}>
                決定
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Dialog>
      </Modal.Container>
      <CreatePlayerModal
        isOpen={profileCreateModal.isOpen}
        onOpenChange={profileCreateModal.setOpen}
        onProfileCreate={(profile: Profile) => {
          setSelectedPlayers((prev) => [...prev, profile]);
        }}
      />
    </Modal.Backdrop>
  );
}
