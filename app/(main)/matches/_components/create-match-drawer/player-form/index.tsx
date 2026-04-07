"use client";

import { useForm } from "@conform-to/react/future";
import {
  Avatar,
  CloseButton,
  Description,
  Drawer,
  EmptyState,
  Label,
  ListBox,
  ScrollShadow,
  SearchField,
  useOverlayState,
} from "@heroui/react";
import { Check, PlusIcon, User as UserIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import type { Profile } from "@/lib/type";
import { createSubmitHandler } from "@/lib/utils/form";
import type { RuleOutput } from "../rule-form/schema";
import { createMatch } from "./actions";
import { ProfileCreateModal } from "./profile-create-modal";
import { playerStepSchema } from "./schema";
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
  const [searchedProfiles, setSearchedProfiles] = useState<Profile[] | null>(
    null,
  );
  const profileCreateModal = useOverlayState({ defaultOpen: false });

  const [lastResult, formAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      return createMatch(ruleData, prevState, formData);
    },
    null,
  );

  const { form, fields } = useForm(playerStepSchema, {
    lastResult,
    onSubmit: createSubmitHandler(formAction),
    shouldRevalidate: "onInput",
  });

  const handleSearch = useDebouncedCallback((text: string) => {
    if (!text) {
      setSearchedProfiles(null);
      return;
    }
    searchProfiles(text)
      .then(setSearchedProfiles)
      .catch((e) => {
        throw e;
      });
  }, 300);

  function handleSelect(key: string | number) {
    if (key === "new") {
      profileCreateModal.open();
      return;
    }
    if (selectedPlayers.find((p) => p.id === key)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== key));
      return;
    }
    const allProfiles = searchedProfiles ?? friends;
    const player = allProfiles.find((p) => p.id === key);
    if (player) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  }

  function handleRemove(player: Profile) {
    setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
  }

  return (
    <Form
      className="contents"
      validationErrors={form.fieldErrors}
      {...form.props}
    >
      <Drawer.Body className="h-[60dvh] max-h-[500px]">
        <div className="flex flex-col">
          {selectedPlayers.map((p) => (
            <input key={p.id} type="hidden" name="playerIds" value={p.id} />
          ))}
          {fields.playerIds.errors && (
            <p className="mb-2 text-sm text-danger">
              {fields.playerIds.errors}
            </p>
          )}

          {selectedPlayers.length > 0 && (
            <div className="mb-4 flex items-center gap-3">
              <p className="mb-2 shrink-0 pl-1 text-xs text-muted">選択中</p>
              <ScrollShadow orientation="horizontal" className="grow">
                <div className="flex gap-2 pt-2">
                  {selectedPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="
                        flex w-12 shrink-0 animate-in flex-col items-center
                        gap-0.5 fade-in
                      "
                    >
                      <div className="relative w-fit">
                        <Avatar size="md" className="">
                          <Avatar.Fallback>
                            <UserIcon />
                          </Avatar.Fallback>
                        </Avatar>
                        {player.id !== userProfile.id && (
                          <CloseButton
                            className="
                              absolute -top-1 -right-1 size-4 rounded-full ring
                              ring-segment
                              *:size-3
                            "
                            onPress={() => handleRemove(player)}
                          />
                        )}
                      </div>
                      <p className="
                        line-clamp-2 w-full text-center text-xs break-all
                        text-foreground
                      ">
                        {player.name}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollShadow>
            </div>
          )}
          <SearchField
            variant="secondary"
            className="mx-1 mb-1"
            onChange={handleSearch}
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="IDもしくは名前で検索" />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          {searchedProfiles === null && (
            <ListBox
              aria-label="フレンド選択"
              onAction={handleSelect}
              className="px-0"
            >
              <ListBox.Item id="new" className="flex w-full items-center">
                <Avatar size="sm" variant="soft" color="accent">
                  <Avatar.Fallback>
                    <PlusIcon />
                  </Avatar.Fallback>
                </Avatar>
                <Label>新規プレイヤー作成</Label>
              </ListBox.Item>
              {friends.map((friend) => (
                <PlayerListBoxItem
                  key={friend.id}
                  player={friend}
                  isSelected={selectedPlayers.some((p) => p.id === friend.id)}
                />
              ))}
            </ListBox>
          )}
          {searchedProfiles !== null && (
            <>
              {searchedProfiles.length === 0 && (
                <EmptyState className="mt-10 text-center">
                  ユーザーが見つかりませんでした
                </EmptyState>
              )}
              {searchedProfiles.length > 0 && (
                <ListBox
                  aria-label="検索結果"
                  onAction={handleSelect}
                  className="px-0"
                >
                  {searchedProfiles.map((item) => (
                    <PlayerListBoxItem
                      key={item.id}
                      player={item}
                      isSelected={selectedPlayers.some((p) => p.id === item.id)}
                    />
                  ))}
                </ListBox>
              )}
            </>
          )}
          <ProfileCreateModal
            isOpen={profileCreateModal.isOpen}
            onClose={profileCreateModal.close}
            onProfileCreate={(profile: Profile) => {
              setSelectedPlayers([...selectedPlayers, profile]);
            }}
          />
        </div>
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
  );
}

function PlayerListBoxItem({
  player,
  isSelected,
}: {
  player: Profile;
  isSelected: boolean;
}) {
  return (
    <ListBox.Item id={player.id}>
      <Avatar size="sm">
        <Avatar.Fallback>
          <UserIcon />
        </Avatar.Fallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <Label>{player.name}</Label>
        </div>
        <Description>@{player.displayId}</Description>
      </div>
      <ListBox.ItemIndicator>{isSelected && <Check />}</ListBox.ItemIndicator>
    </ListBox.Item>
  );
}
