"use client";

import { Dropdown, type Key, Label } from "@heroui/react";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/button";
import { deleteFriend } from "./actions";

export function FriendMenu({ profileId }: { profileId: string }) {
  function handleAction(key: Key) {
    if (key === "delete") {
      deleteFriend(profileId).catch((e) => {
        throw e;
      });
    }
  }

  return (
    <Dropdown>
      <Button size="sm" variant="ghost" isIconOnly aria-label="フレンドメニュー">
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
