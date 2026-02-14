"use client";

import { type Key, Label } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/dropdown";
import { signOut } from "./actions";

export function AppbarAvatarMenu({
  name,
  displayId,
}: {
  name: string;
  displayId: string;
}) {
  const router = useRouter();

  function handleProfileMenuAction(key: Key) {
    switch (key) {
      case "friends":
        // prefetchしたほうが早いかも
        router.push("/friends");
        break;
      case "signOut":
        signOut().catch((e) => {
          throw e;
        });
        break;
    }
  }

  return (
    <Dropdown.Menu
      className="max-w-[70vw]"
      aria-label="プロフィール"
      onAction={handleProfileMenuAction}
    >
      <Dropdown.Item
        id="profile"
        className="h-14 gap-2"
        textValue={`${name}@${displayId}`}
      >
        <p className="text-wrap break-all">{name}</p>
        <p className="text-wrap break-all">@{displayId}</p>
      </Dropdown.Item>
      <Dropdown.Item id="friends">
        <Label>フレンド</Label>
      </Dropdown.Item>
      <Dropdown.Item id="signOut" variant="danger">
        <Label>ログアウト</Label>
      </Dropdown.Item>
    </Dropdown.Menu>
  );
}
