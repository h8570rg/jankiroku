"use client";

import { Drawer, useOverlayState } from "@heroui/react";
import { useActionState, useState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import type { Profile } from "@/lib/type";
import { createSubmitHandler } from "@/lib/utils/form";
import { PlayerSelector } from "../../player-selector";
import { CreatePlayerModal } from "../create-player-modal";
import type { RuleOutput } from "../rule-form/schema";
import { createMatch } from "./actions";
import { searchProfiles } from "./search-profiles";

export function PlayerForm({
  ruleData,
  userProfile,
  friends,
  onBack,
}: {
  ruleData: RuleOutput;
  userProfile: Profile;
  friends: Profile[];
  onBack: () => void;
}) {
  const [selectedPlayers, setSelectedPlayers] = useState<Profile[]>([
    userProfile,
  ]);
  const profileCreateModal = useOverlayState({ defaultOpen: false });

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
            onNewPlayerRequest={profileCreateModal.open}
            searchAction={searchProfiles}
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
        isOpen={profileCreateModal.isOpen}
        onOpenChange={profileCreateModal.setOpen}
        onProfileCreate={(profile: Profile) => {
          setSelectedPlayers([...selectedPlayers, profile]);
        }}
      />
    </>
  );
}
