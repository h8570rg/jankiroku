"use client";

import { Button } from "~/components/Button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "~/components/Dropdown";
import { Icon } from "~/components/Icon";
import { deleteFriends } from "./actions";

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
          <Icon className="size-5 fill-current" name="more" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="フレンドメニュー" onAction={handleAction}>
        <DropdownItem key="delete">削除</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
