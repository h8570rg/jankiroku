"use client";

import { CloseButton, Header } from "@heroui/react";
import { Check, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/button";
import { Chip } from "@/components/chip";
import { ListBox } from "@/components/listbox";
import { Modal, useOverlayState } from "@/components/modal";
import { ScrollShadow } from "@/components/scroll-shadow";
import { SearchField } from "@/components/search-field";
import { User } from "@/components/user";
import type { Profile } from "@/lib/type";
import { searchProfiles, updateMatchPlayers } from "./actions";
import { ProfileCreateModal } from "./profile-create-modal";

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
  const [searchedProfiles, setSearchedProfiles] = useState<Profile[] | null>(
    null,
  );
  const [selectedPlayers, setSelectedPlayers] = useState<Profile[]>(players);

  const profileCreateModal = useOverlayState({
    defaultOpen: false,
  });

  const [isPending, setIsPending] = useState(false);

  const handleSearch = useDebouncedCallback((text: string) => {
    if (!text) {
      setSearchedProfiles(null);
      return;
    }
    searchProfiles(text)
      .then((searchProfilesResult) => {
        setSearchedProfiles(searchProfilesResult);
      })
      .catch((e) => {
        throw e;
      });
  }, 300);

  // TODO: 下と共通化
  function handleFriendSelect(key: string | number) {
    if (key === "new") {
      profileCreateModal.open();
      return;
    }

    if (selectedPlayers.find((p) => p.id === key)) {
      if (players.some((p) => p.id === key)) {
        alert("すでに参加中のプレイヤーは削除できません");
        return;
      }
      setSelectedPlayers((prev) => prev.filter((p) => p.id !== key));
      return;
    }

    const player = friends.find((profile) => profile.id === key);
    if (!player) {
      return;
    }
    setSelectedPlayers((prev) => [...prev, player]);
  }

  function handleSearchedProfileSelect(key: string | number) {
    if (selectedPlayers?.find((p) => p.id === key)) {
      if (players.some((p) => p.id === key)) {
        alert("すでに参加中のプレイヤーは削除できません");
        return;
      }
      setSelectedPlayers((prev) => prev.filter((p) => p.id !== key));
      return;
    }
    const player = searchedProfiles?.find((profile) => profile.id === key);
    if (!player) {
      return;
    }
    setSelectedPlayers((prev) => [...prev, player]);
  }

  function handlePlayersRemove(player: Profile) {
    setSelectedPlayers((prev) => prev.filter((p) => p.id !== player.id));
  }

  return (
    <>
      <Modal.Header>
        <Modal.Heading>プレイヤー選択</Modal.Heading>
      </Modal.Header>
      <Modal.Body className="p-1">
        <div className="flex h-[700px] max-h-[60dvh] flex-col">
          {selectedPlayers.length > 0 && (
            <div className="mb-6">
              <p className="mb-2 pl-1 text-xs text-muted">
                参加者 ({selectedPlayers.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedPlayers.map((player) => (
                  <Chip key={player.id} variant="primary" color="accent">
                    <UserIcon />

                    <Chip.Label>{player.name}</Chip.Label>
                    <CloseButton
                      className="bg-transparent text-foreground"
                      onPress={() => handlePlayersRemove(player)}
                    />
                  </Chip>
                ))}
              </div>
            </div>
          )}
          <SearchField
            variant="secondary"
            className="mb-1"
            placeholder="ユーザーIDもしくは名前で検索"
            onChange={handleSearch}
          />
          <ScrollShadow className="min-h-0">
            {searchedProfiles === null && (
              <ListBox
                aria-label="ユーザー選択"
                onAction={handleFriendSelect}
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
                      // TODO: nameが必ず存在するか確認
                      textValue={friend.name ?? ""}
                      className="flex w-full items-center justify-between"
                    >
                      <User name={friend.name} displayId={friend.displayId} />
                      {/* Listboxで静的itemと動的itemを同時に扱えないので、selectionModeは使わず、selectedIconも自作する */}
                      {selectedPlayers.some((p) => p.id === friend.id) && (
                        <Check />
                      )}
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
                    aria-label="ユーザー一覧"
                    onAction={handleSearchedProfileSelect}
                    className="px-0"
                  >
                    {searchedProfiles.map((item) => (
                      <ListBox.Item
                        id={item.id}
                        key={item.id}
                        // TODO: nameが必ず存在するか確認
                        textValue={item.name ?? ""}
                        className="flex w-full items-center justify-between"
                      >
                        <User name={item.name} displayId={item.displayId} />
                        {selectedPlayers.some((p) => p.id === item.id) && (
                          <Check />
                        )}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                )}
              </>
            )}
          </ScrollShadow>
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
      <ProfileCreateModal
        isOpen={profileCreateModal.isOpen}
        onClose={profileCreateModal.close}
        onProfileCreate={(profile: Profile) => {
          setSelectedPlayers((prev) => [...prev, profile]);
        }}
      />
    </>
  );
}
