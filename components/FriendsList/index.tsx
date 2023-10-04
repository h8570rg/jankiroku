"use client";

import { useCallback } from "react";
import { useDeleteFriend, useFriends } from "~/lib/hooks/api/friends";
import { Friend } from "~/lib/services/friends";
import { Button } from "../Button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "../Dropdown";
import { Icon } from "../Icon";
import { Skeleton } from "../Skeleton";
import { User } from "../User";

const friendSkeleton: Friend[] = Array.from({ length: 3 }).map((_, i) => ({
  id: `skeleton-friend-${i}`,
  name: "",
  janrecoId: "",
}));

export function FriendsList({
  showMenu = true,
  isSelectable = false,
  onSelect,
  excludeFriendIds = [],
}: {
  showMenu?: boolean;
  isSelectable?: boolean;
  onSelect?: (profileId: string) => void;
  excludeFriendIds?: string[];
}) {
  const { data: friends, isLoading: isFriendLoading } = useFriends();

  const selectableFriends =
    friends?.filter((friend) => !excludeFriendIds.includes(friend.id)) ?? [];

  return (
    <ul className="space-y-1">
      {isFriendLoading
        ? friendSkeleton.map(({ id }) => (
            <li key={id}>
              <FriendSkeleton showMenu={showMenu} />
            </li>
          ))
        : selectableFriends?.map((friend) => (
            <li key={friend.id}>
              <Friend
                friend={friend}
                showMenu={showMenu}
                isSelectable={isSelectable}
                onSelect={onSelect}
              />
            </li>
          ))}
    </ul>
  );
}

export function FriendSkeleton({ showMenu }: { showMenu: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <User skeleton />
      {showMenu && (
        <Skeleton className="rounded">
          <Button size="sm" variant="light" isIconOnly>
            <Icon className="h-5 w-5 fill-current" name="more" />
          </Button>
        </Skeleton>
      )}
    </div>
  );
}

export function Friend({
  friend,
  showMenu,
  isSelectable,
  onSelect,
}: {
  friend: Friend;
  showMenu: boolean;
  isSelectable: boolean;
  onSelect?: (profileId: string) => void;
}) {
  const { trigger: deleteFriend } = useDeleteFriend();

  const handleMenuAction = useCallback(
    async (key: unknown, friendId: string) => {
      if (key === "delete") {
        await deleteFriend({ profileId: friendId });
      }
    },
    [deleteFriend],
  );

  const handleSelect = useCallback(() => {
    onSelect?.(friend.id);
  }, [friend.id, onSelect]);

  return (
    <div className="flex items-center justify-between py-2">
      <User {...friend} />
      {isSelectable && (
        <Button size="sm" color="primary" onClick={handleSelect}>
          決定
        </Button>
      )}
      {showMenu && (
        <Dropdown>
          <DropdownTrigger>
            <Button size="sm" variant="light" isIconOnly>
              <Icon className="h-5 w-5 fill-current" name="more" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="フレンドメニュー"
            onAction={(key) => handleMenuAction(key, friend.id)}
          >
            <DropdownItem key="delete">削除</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
}
