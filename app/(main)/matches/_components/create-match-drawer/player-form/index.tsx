"use client";

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
  const [searchedProfiles, setSearchedProfiles] = useState<Profile[] | null>(
    null,
  );
  const profileCreateModal = useOverlayState({ defaultOpen: false });

  const [lastResult, formAction, isPending] = useActionState(
    createMatch.bind(null, ruleData),
    null,
  );

  function insertSelectedPlayer(player: Profile) {
    setSelectedPlayers([...selectedPlayers, player]);
  }

  function removeSelectedPlayer(playerId: string) {
    setSelectedPlayers(selectedPlayers.filter((p) => p.id !== playerId));
  }

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

  function handleFriendListBoxAction(key: string | number) {
    // 新規プレイヤー作成の場合
    if (key === "new") {
      profileCreateModal.open();
      return;
    }
    const isPlayerSelected = selectedPlayers.some((p) => p.id === key);
    if (isPlayerSelected) {
      removeSelectedPlayer(String(key));
      return;
    }
    const player = friends.find((p) => p.id === key);
    if (player) {
      insertSelectedPlayer(player);
    }
  }

  function handleSearchedProfileListBoxAction(key: string | number) {
    const isPlayerSelected = selectedPlayers.some((p) => p.id === key);
    if (isPlayerSelected) {
      removeSelectedPlayer(String(key));
      return;
    }
    const player = searchedProfiles?.find((p) => p.id === key);
    if (player) {
      insertSelectedPlayer(player);
    }
  }

  return (
    <>
      <Form className="contents" onSubmit={createSubmitHandler(formAction)}>
        <Drawer.Body>
          {selectedPlayers.map((p) => (
            <input key={p.id} type="hidden" name="playerIds" value={p.id} />
          ))}

          {selectedPlayers.length > 0 && (
            <div className="flex items-center gap-3">
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
                            onPress={() => removeSelectedPlayer(player.id)}
                          />
                        )}
                      </div>
                      <p
                        className="
                          line-clamp-2 w-full text-center text-xs break-all
                          text-foreground
                        "
                      >
                        {player.name}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollShadow>
            </div>
          )}
          {lastResult?.error?.fieldErrors?.playerIds && (
            <p className="mt-2 text-sm text-danger">
              {lastResult.error.fieldErrors.playerIds}
            </p>
          )}
          <SearchField
            variant="secondary"
            className="mx-1 mt-4 mb-1"
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
              onAction={handleFriendListBoxAction}
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
                  onAction={handleSearchedProfileListBoxAction}
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
