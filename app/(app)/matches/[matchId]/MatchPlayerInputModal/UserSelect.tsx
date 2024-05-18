"use client";

import { useCallback, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useDebouncedCallback } from "use-debounce";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { ScrollShadow } from "~/components/ScrollShadow";
import { User } from "~/components/User";
import { Profile } from "~/lib/type";
import { useMatchPlayerInputModal } from "../useMatchPlayerInputModal";
import { addUserPlayer, searchProfiles } from "./actions";

export function UserSelect({
  matchId,
  friends,
  playerIds,
}: {
  matchId: string;
  friends: Profile[];
  playerIds: string[];
}) {
  const matchPlayerInputModal = useMatchPlayerInputModal();
  const formRef = useRef<HTMLFormElement>(null);
  const [{ profiles }, formAction] = useFormState(searchProfiles, {});

  const selectableFriends = friends.filter(
    (friend) => !playerIds.includes(friend.id),
  );

  const selectableProfiles = profiles?.filter(
    (profile) => !playerIds.includes(profile.id),
  );

  const handleChange = useDebouncedCallback(() => {
    formRef.current?.requestSubmit();
  }, 300);

  const selectUser = useCallback(
    (playerId: string) => {
      // TODO: await中の表示
      addUserPlayer({ matchId, playerId });
      // TODO: server側でredirectしてもいいかも
      matchPlayerInputModal.onClose();
    },
    [matchId, matchPlayerInputModal],
  );

  return (
    <form className="flex h-full flex-col" ref={formRef} action={formAction}>
      <Input
        className="mb-3"
        size="sm"
        name="text"
        placeholder="ユーザーIDもしくは名前で検索"
        startContent={<Icon className="size-5 fill-current" name="search" />}
        onChange={handleChange}
      />
      <ScrollShadow className="min-h-0">
        {!!selectableProfiles && (
          <ProfileList profiles={selectableProfiles} onSelect={selectUser} />
        )}
        {!profiles && !!friends.length && (
          <>
            <p className="mb-2 text-small text-foreground-light">
              フレンドから選ぶ
            </p>
            <ul className="space-y-1">
              {selectableFriends.map((friend) => (
                <li className="py-1" key={friend.id}>
                  {/* TODO: ripple */}
                  <button type="button" onClick={() => selectUser(friend.id)}>
                    <User name={friend.name} janrecoId={friend.janrecoId} />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </ScrollShadow>
    </form>
  );
}

function ProfileList({
  profiles,
  onSelect,
}: {
  profiles: Profile[];
  onSelect: (profileId: string) => void;
}) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <ul className="space-y-1">
        {Array.from({ length: 1 }).map((_, i) => (
          <li
            key={`search-profiles-${i}`}
            className="flex items-center justify-between py-2"
          >
            <User skeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (!profiles.length) {
    return (
      <p className="mt-10 text-center text-small text-foreground-light">
        見つかりませんでした
      </p>
    );
  }

  return (
    <ul className="space-y-1">
      {profiles.map((profile) => (
        <li key={profile.id}>
          {/* TODO: ripple, 共通化, 連打対策, 見た目 */}
          <button
            className="flex w-full py-1"
            type="button"
            onClick={() => onSelect(profile.id)}
          >
            <User name={profile.name} janrecoId={profile.janrecoId} />
          </button>
        </li>
      ))}
    </ul>
  );
}
