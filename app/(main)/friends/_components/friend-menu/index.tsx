"use client";

import { Button } from "@/components/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/dropdown";
import { Icon } from "@/components/icon";
import { deleteFriends } from "./actions";

export function FriendMenu({ profileId }: { profileId: string }) {
  function handleAction(key: unknown) {
    if (key === "delete") {
      deleteFriends(profileId).catch((e) => {
        throw e;
      });
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
