"use client";

import { deleteFriends } from "~/app/(app)/friends/actions";
import { Button } from "~/components/Button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "~/components/Dropdown";
import { Icon } from "~/components/Icon";

export function FriendMenu({ profileId }: { profileId: string }) {
  function handleAction(key: unknown) {
    if (key === "delete") {
      deleteFriends(profileId);
    }
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button size="sm" variant="light" isIconOnly>
          <Icon className="h-5 w-5 fill-current" name="more" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="フレンドメニュー" onAction={handleAction}>
        <DropdownItem key="delete">削除</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
