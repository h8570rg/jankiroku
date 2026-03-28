"use client";

import { useField } from "@conform-to/react/future";
import {
  Chip,
  CloseButton,
  Header,
  ListBox,
  ScrollShadow,
  SearchField,
  useOverlayState,
} from "@heroui/react";
import { Check, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { User } from "@/components/user";
import type { Profile } from "@/lib/type";
import { searchProfiles } from "./player-actions";
import { ProfileCreateModal } from "./profile-create-modal";

export function PlayerStep({ friends }: { friends: Profile[] }) {
  const [selectedPlayers, setSelectedPlayers] = useState<Profile[]>([]);
  const [searchedProfiles, setSearchedProfiles] = useState<Profile[] | null>(
    null,
  );
  const playerIdsField = useField("playerIds");
  const profileCreateModal = useOverlayState({ defaultOpen: false });

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
    <div className="flex h-[60dvh] max-h-[500px] flex-col">
      {selectedPlayers.map((p) => (
        <input key={p.id} type="hidden" name="playerIds" value={p.id} />
      ))}
      {playerIdsField.errors && (
        <p className="mb-2 text-sm text-danger">{playerIdsField.errors}</p>
      )}
      {selectedPlayers.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 pl-1 text-xs text-muted">
            参加者 ({selectedPlayers.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedPlayers.map((player) => (
              <Chip key={player.id} variant="primary" color="accent">
                <UserIcon className="size-3" />
                <Chip.Label>{player.name}</Chip.Label>
                <CloseButton
                  className="bg-transparent text-foreground"
                  onPress={() => handleRemove(player)}
                />
              </Chip>
            ))}
          </div>
        </div>
      )}
      <SearchField variant="secondary" className="mb-1" onChange={handleSearch}>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input placeholder="ユーザーIDもしくは名前で検索" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      <ScrollShadow className="min-h-0">
        {searchedProfiles === null && (
          <ListBox
            aria-label="ユーザー選択"
            onAction={handleSelect}
            className="px-0"
          >
            <ListBox.Section>
              <Header>新規ユーザー</Header>
              <ListBox.Item id="new" textValue="新規ユーザー">
                <User name="プレイヤー名を入力" />
              </ListBox.Item>
            </ListBox.Section>
            <ListBox.Section>
              <Header>フレンド</Header>
              {friends.map((friend) => (
                <ListBox.Item
                  key={friend.id}
                  id={friend.id}
                  textValue={friend.name ?? ""}
                  className="flex w-full items-center justify-between"
                >
                  <User name={friend.name} displayId={friend.displayId} />
                  {selectedPlayers.some((p) => p.id === friend.id) && <Check />}
                </ListBox.Item>
              ))}
            </ListBox.Section>
          </ListBox>
        )}
        {searchedProfiles !== null && (
          <>
            {searchedProfiles.length === 0 && (
              <p className="mt-10 text-center text-sm text-muted">
                見つかりませんでした
              </p>
            )}
            {searchedProfiles.length > 0 && (
              <ListBox
                aria-label="検索結果"
                onAction={handleSelect}
                className="px-0"
              >
                {searchedProfiles.map((item) => (
                  <ListBox.Item
                    key={item.id}
                    id={item.id}
                    textValue={item.name ?? ""}
                    className="flex w-full items-center justify-between"
                  >
                    <User name={item.name} displayId={item.displayId} />
                    {selectedPlayers.some((p) => p.id === item.id) && <Check />}
                  </ListBox.Item>
                ))}
              </ListBox>
            )}
          </>
        )}
      </ScrollShadow>
      <ProfileCreateModal
        isOpen={profileCreateModal.isOpen}
        onClose={profileCreateModal.close}
        onProfileCreate={(profile: Profile) => {
          setSelectedPlayers([...selectedPlayers, profile]);
        }}
      />
    </div>
  );
}
