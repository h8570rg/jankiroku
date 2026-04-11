"use client";

import { Dropdown, type Key, Label } from "@heroui/react";
import { useRouter } from "next/navigation";
import { signOut } from "./actions";

export function AppbarAvatarMenu() {
  const router = useRouter();

  function handleProfileMenuAction(key: Key) {
    switch (key) {
      case "editProfile":
        router.push("/profile");
        break;
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
      <Dropdown.Item id="editProfile">
        <Label>プロフィール編集</Label>
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
