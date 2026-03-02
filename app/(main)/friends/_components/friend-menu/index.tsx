"use client";

import { type Key, Label } from "@heroui/react";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/button";
import { Dropdown } from "@/components/dropdown";
import { deleteFriends } from "./actions";

export function FriendMenu({ profileId }: { profileId: string }) {
  function handleAction(key: Key) {
    if (key === "delete") {
      deleteFriends(profileId).catch((e) => {
        throw e;
      });
    }
  }

  return (
    <Dropdown>
      <Button size="sm" variant="ghost" isIconOnly>
        <EllipsisVertical />
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu aria-label="フレンドメニュー" onAction={handleAction}>
          <Dropdown.Item id="delete" variant="danger">
            <Label>削除</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
