"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { Icon } from "@/components/Icon";
import { Input } from "@/components/Input";
import { Listbox, ListboxItem, ListboxSection } from "@/components/Listbox";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@/components/Modal";
import { ScrollShadow } from "@/components/ScrollShadow";
import { User } from "@/components/User";
import { Profile } from "@/lib/type";
import { ProfileCreateModal } from "./(components)/ProfileCreateModal";
import { searchProfiles, updateMatchPlayers } from "./actions";

export function MatchPlayerInputModalContent({
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
  } = useDisclosure();

  const [isPending, setIsPending] = useState(false);

  const handleSearch = useDebouncedCallback(async (text: string) => {
    if (!text) {
      setSearchedProfiles(null);
      return;
    }
    const searchProfilesResult = await searchProfiles(text);
    setSearchedProfiles(searchProfilesResult);
  }, 300);

  function handleFriendSelect(key: string | number) {
    if (key === "new") {
      onOpenProfileCreateModal();
      return;
    }

    if (selectedPlayers.find((p) => p.id === key)) {
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
                <div className="mb-3 space-y-5">
                  <Input
                    placeholder="ユーザーIDもしくは名前で検索"
                    startContent={
                      <Icon className="size-5 fill-current" name="search" />
                    }
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {selectedPlayers.length > 0 && (
                    <div className="flex flex-wrap gap-3">
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
                  )}
                </div>
                <ScrollShadow className="min-h-0">
                  <>
                    {searchedProfiles === null && (
                      <>
                        <Listbox
                          aria-label="ユーザー選択"
                          onAction={handleFriendSelect}
                          className="px-0"
                        >
                          <ListboxSection title="新規ユーザー">
                            <ListboxItem key="new" textValue="新規ユーザー">
                              <User
                                name="新規ユーザーを作成する"
                                avatarProps={{
                                  fallback: (
                                    <Icon className="size-6" name="add" />
                                  ),
                                }}
                              />
                            </ListboxItem>
                          </ListboxSection>
                          <ListboxSection title="フレンド">
                            {friends.map((friend) => (
                              <ListboxItem
                                key={friend.id}
                                textValue={friend.name!}
                                classNames={{
                                  title:
                                    "flex items-center justify-between w-full",
                                }}
                              >
                                <User
                                  name={friend.name}
                                  janrecoId={friend.janrecoId}
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
                      </>
                    )}
                    {searchedProfiles !== null && (
                      <>
                        {searchedProfiles.length === 0 && (
                          <p className="mt-10 text-center text-small text-foreground-light">
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
                              <ListboxItem key={item.id} textValue={item.name!}>
                                <User
                                  name={item.name}
                                  janrecoId={item.janrecoId}
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
                  </>
                </ScrollShadow>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                isLoading={isPending}
                onClick={async () => {
                  setIsPending(true);
                  await updateMatchPlayers({
                    matchId,
                    playerIds: selectedPlayers
                      .map((p) => p.id)
                      .filter((p) => !players.some((p2) => p2.id === p)),
                  });
                  setIsPending(false);
                  onClose();
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
