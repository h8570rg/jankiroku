"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/button";
import { Chip } from "@/components/chip";
import { Icon } from "@/components/icon";
import { Input } from "@/components/input";
import { Listbox, ListboxItem, ListboxSection } from "@/components/listbox";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useModal,
} from "@/components/modal";
import { ScrollShadow } from "@/components/scroll-shadow";
import { User } from "@/components/user";
import type { Profile } from "@/lib/type";
import { searchProfiles, updateMatchPlayers } from "./actions";
import { ProfileCreateModal } from "./profile-create-modal";

export function PlayersModalContent({
  matchId,
  friends,
  players,
}: {
  matchId: string;
  friends: Profile[];
  players: Profile[];
}) {
  const [searchedProfiles, setSearchedProfiles] = useState<Profile[] | null>(
    null,
  );
  const [selectedPlayers, setSelectedPlayers] = useState<Profile[]>(players);

  const {
    isOpen: isProfileCreateModalOpen,
    onClose: onProfileCreateModalClose,
    onOpen: onOpenProfileCreateModal,
  } = useModal();

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
      onOpenProfileCreateModal();
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
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>プレイヤー選択</ModalHeader>
            <ModalBody>
              <div className="flex h-[700px] max-h-[60dvh] flex-col">
                {selectedPlayers.length > 0 && (
                  <div className="mb-6">
                    <p className="mb-2 pl-1 text-tiny text-foreground-500">
                      参加者 ({selectedPlayers.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlayers.map((player) => (
                        <Chip
                          key={player.id}
                          color="primary"
                          avatar={<Avatar name="" />}
                          onClose={
                            !players.some((p) => p.id === player.id)
                              ? () => handlePlayersRemove(player)
                              : undefined
                          }
                        >
                          {player.name}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
                <Input
                  className="mb-1"
                  placeholder="ユーザーIDもしくは名前で検索"
                  startContent={
                    <Icon className="size-5 fill-current" name="search" />
                  }
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <ScrollShadow className="min-h-0">
                  {searchedProfiles === null && (
                    <Listbox
                      aria-label="ユーザー選択"
                      onAction={handleFriendSelect}
                      className="px-0"
                    >
                      <ListboxSection title="新規ユーザー">
                        <ListboxItem key="new" textValue="新規ユーザー">
                          <User
                            name="プレイヤー名を入力"
                            avatarProps={{
                              fallback: <Icon className="size-6" name="edit" />,
                              classNames: {
                                base: "bg-secondary text-secondary-foreground",
                              },
                            }}
                          />
                        </ListboxItem>
                      </ListboxSection>
                      <ListboxSection title="フレンド">
                        {friends.map((friend) => (
                          <ListboxItem
                            key={friend.id}
                            // TODO: nameが必ず存在するか確認
                            textValue={friend.name ?? ""}
                            classNames={{
                              title: "flex items-center justify-between w-full",
                            }}
                          >
                            <User
                              name={friend.name}
                              displayId={friend.displayId}
                            />
                            {/* Listboxで静的itemと動的itemを同時に扱えないので、selectionModeは使わず、selectedIconも自作する */}
                            {selectedPlayers.some(
                              (p) => p.id === friend.id,
                            ) && (
                              <Icon
                                className="size-6 fill-primary"
                                name="check-filled"
                              />
                            )}
                          </ListboxItem>
                        ))}
                      </ListboxSection>
                    </Listbox>
                  )}
                  {searchedProfiles !== null && (
                    <>
                      {searchedProfiles.length === 0 && (
                        <p className="mt-10 text-center text-small text-default-500">
                          見つかりませんでした
                        </p>
                      )}
                      {searchedProfiles.length > 0 && (
                        <Listbox
                          aria-label="ユーザー一覧"
                          onAction={handleSearchedProfileSelect}
                          className="px-0"
                          itemClasses={{
                            base: "px-0",
                            title: "flex items-center justify-between w-full",
                          }}
                        >
                          {searchedProfiles.map((item) => (
                            <ListboxItem
                              key={item.id}
                              // TODO: nameが必ず存在するか確認
                              textValue={item.name ?? ""}
                            >
                              <User
                                name={item.name}
                                displayId={item.displayId}
                              />
                              {selectedPlayers.some(
                                (p) => p.id === item.id,
                              ) && (
                                <Icon
                                  className="size-6 fill-primary"
                                  name="check-filled"
                                />
                              )}
                            </ListboxItem>
                          ))}
                        </Listbox>
                      )}
                    </>
                  )}
                </ScrollShadow>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                isLoading={isPending}
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
                      onClose();
                    })
                    .catch((e) => {
                      throw e;
                    });
                }}
              >
                決定
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
      <ProfileCreateModal
        isOpen={isProfileCreateModalOpen}
        onClose={onProfileCreateModalClose}
        onProfileCreate={(profile: Profile) => {
          setSelectedPlayers((prev) => [...prev, profile]);
        }}
      />
    </>
  );
}
