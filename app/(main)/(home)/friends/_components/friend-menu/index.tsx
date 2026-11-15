"use client";

import { Dropdown, type Key, Label } from "@heroui/react";
import { EllipsisVertical } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/button";
import { deleteFriend } from "./actions";

export function FriendMenu({ profileId }: { profileId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleAction(key: Key) {
    if (key === "delete") {
      startTransition(async () => {
        await deleteFriend(profileId);
      });
    }
  }

  return (
    <Dropdown>
      <Button
        size="sm"
        variant="ghost"
        isIconOnly
        aria-label="フレンドメニュー"
        isPending={isPending}
      >
        {!isPending && <EllipsisVertical />}
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
