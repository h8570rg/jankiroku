"use client";

import {
  Avatar,
  CloseButton,
  Description,
  EmptyState,
  Label,
  ListBox,
  ScrollShadow,
  SearchField,
} from "@heroui/react";
import { Check, PlusIcon, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { Profile } from "@/lib/type";

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

export function PlayerSelector({
  friends,
  selectedPlayers,
  onSelectedPlayersChange,
  disabledPlayerIds = [],
  onNewPlayerRequest,
  searchAction,
  error,
}: {
  friends: Profile[];
  selectedPlayers: Profile[];
  onSelectedPlayersChange: (players: Profile[]) => void;
  disabledPlayerIds?: string[];
  onNewPlayerRequest: () => void;
  searchAction: (text: string) => Promise<Profile[]>;
  error?: string | string[];
}) {
  const [searchedProfiles, setSearchedProfiles] = useState<Profile[] | null>(
    null,
  );

  const handleSearch = useDebouncedCallback((text: string) => {
    if (!text) {
      setSearchedProfiles(null);
      return;
    }
    searchAction(text)
      .then(setSearchedProfiles)
      .catch((e) => {
        throw e;
      });
  }, 300);

  function insertSelectedPlayer(player: Profile) {
    onSelectedPlayersChange([...selectedPlayers, player]);
  }

  function removeSelectedPlayer(playerId: string) {
    if (disabledPlayerIds.includes(playerId)) {
      alert("すでに参加中のプレイヤーは削除できません");
      return;
    }
    onSelectedPlayersChange(selectedPlayers.filter((p) => p.id !== playerId));
  }

  function handleListBoxAction(key: string | number, source: Profile[] | null) {
    if (key === "new") {
      onNewPlayerRequest();
      return;
    }
    if (selectedPlayers.some((p) => p.id === key)) {
      removeSelectedPlayer(String(key));
      return;
    }
    const player = source?.find((p) => p.id === key);
    if (player) {
      insertSelectedPlayer(player);
    }
  }

  return (
    <>
      {selectedPlayers.length > 0 && (
        <div className="flex items-center gap-3">
          <p className="mb-2 shrink-0 pl-1 text-xs text-muted">選択中</p>
          <ScrollShadow orientation="horizontal" className="grow">
            <div className="flex gap-2 pt-2">
              {selectedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="
                    flex w-12 shrink-0 animate-in flex-col items-center gap-0.5
                    fade-in
                  "
                >
                  <div className="relative w-fit">
                    <Avatar size="md">
                      <Avatar.Fallback>
                        <UserIcon />
                      </Avatar.Fallback>
                    </Avatar>
                    {!disabledPlayerIds.includes(player.id) && (
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
      {error && (
        <p className="mt-2 text-sm text-danger">
          {Array.isArray(error) ? error[0] : error}
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
          onAction={(key) => handleListBoxAction(key, friends)}
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
              onAction={(key) => handleListBoxAction(key, searchedProfiles)}
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
    </>
  );
}
