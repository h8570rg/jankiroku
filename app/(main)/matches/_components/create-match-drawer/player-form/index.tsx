"use client";

import { Drawer, useOverlayState } from "@heroui/react";
import { useActionState, useState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import type { Player, UserProfile } from "@/lib/type";
import { createSubmitHandler } from "@/lib/utils/form";
import { PlayerSelector } from "../../player-selector";
import { CreatePlayerModal } from "../../player-selector/create-player-modal";
import type { RuleOutput } from "../rule-form/schema";
import { createMatch } from "./actions";
import { searchPlayers } from "./search-players";

export function PlayerForm({
  ruleData,
  userProfile,
  friends,
  onBack,
}: {
  ruleData: RuleOutput;
  userProfile: UserProfile;
  friends: Player[];
  onBack: () => void;
}) {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([
    userProfile,
  ]);
  const playerCreateModal = useOverlayState({ defaultOpen: false });

  const [lastResult, formAction, isPending] = useActionState(
    createMatch.bind(null, ruleData),
    null,
  );

  return (
    <>
      <Form className="contents" onSubmit={createSubmitHandler(formAction)}>
        <Drawer.Body>
          {selectedPlayers.map((p) => (
            <input key={p.id} type="hidden" name="playerIds" value={p.id} />
          ))}
          <PlayerSelector
            friends={friends}
            selectedPlayers={selectedPlayers}
            onSelectedPlayersChange={setSelectedPlayers}
            disabledPlayerIds={[userProfile.id]}
            onNewPlayerRequest={playerCreateModal.open}
            searchAction={searchPlayers}
            error={lastResult?.error?.fieldErrors?.playerIds}
          />
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="ghost" onPress={onBack}>
            戻る
          </Button>
          <Button variant="primary" type="submit" isPending={isPending}>
            ゲーム開始
          </Button>
        </Drawer.Footer>
      </Form>
      <CreatePlayerModal
        isOpen={playerCreateModal.isOpen}
        onOpenChange={playerCreateModal.setOpen}
        onPlayerCreate={(profile: Player) => {
          setSelectedPlayers([...selectedPlayers, profile]);
        }}
      />
    </>
  );
}
