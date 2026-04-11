"use client";

import { Drawer, useOverlayState } from "@heroui/react";
import { useActionState, useState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import type { Profile } from "@/lib/type";
import { createSubmitHandler, withCallbacks } from "@/lib/utils/form";
import { PlayerSelector } from "../../../_components/player-selector";
import { CreatePlayerModal } from "../../../_components/player-selector/create-player-modal";
import { searchProfiles, updateMatchPlayers } from "./actions";

export type PlayersDrawerProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  matchId: string;
  friends: Profile[];
  players: Profile[];
};

export function PlayersDrawer({
  isOpen,
  onOpenChange,
  matchId,
  friends,
  players,
}: PlayersDrawerProps) {
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
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <Drawer.Dialog>
          <Drawer.Header>
            <Drawer.Heading>プレイヤー選択</Drawer.Heading>
          </Drawer.Header>
          <Form className="contents" onSubmit={createSubmitHandler(formAction)}>
            <Drawer.Body>
              {selectedPlayers.map((p) => (
                <input key={p.id} type="hidden" name="playerIds" value={p.id} />
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
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="primary" type="submit" isPending={isPending}>
                決定
              </Button>
            </Drawer.Footer>
          </Form>
        </Drawer.Dialog>
      </Drawer.Content>
      <CreatePlayerModal
        isOpen={profileCreateModal.isOpen}
        onOpenChange={profileCreateModal.setOpen}
        onProfileCreate={(profile: Profile) => {
          setSelectedPlayers((prev) => [...prev, profile]);
        }}
      />
    </Drawer.Backdrop>
  );
}
