"use client";

import classNames from "classnames";
import { useCallback } from "react";
import { Button } from "~/components/Button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "~/components/Dropdown";
import { Icon } from "~/components/Icon";
import { User } from "~/components/User";
import { useDeleteFriend, useFriends } from "~/lib/hooks/api/friends";
import { Friend } from "~/lib/services/friends";

export default function FriendsList({
  defaultValue,
  className,
}: {
  defaultValue: Friend[];
  className?: string;
}) {
  const { data: friends } = useFriends(defaultValue);

  const { trigger: deleteFriend } = useDeleteFriend();

  const handleMenuAction = useCallback(
    async (key: unknown, friendId: string) => {
      if (key === "delete") {
        await deleteFriend({ profileId: friendId });
      }
    },
    [deleteFriend],
  );

  return (
    <ul className={classNames(className, "space-y-2")}>
      {friends.map((friend) => (
        <li className="flex items-center justify-between py-2" key={friend.id}>
          <User {...friend} />
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
        </li>
      ))}
    </ul>
  );
}
