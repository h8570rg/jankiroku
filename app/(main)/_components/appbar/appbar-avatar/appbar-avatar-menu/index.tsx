"use client";

import { Dropdown, type Key, Label, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { signOut } from "./actions";

export function AppbarAvatarMenu() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleProfileMenuAction(key: Key) {
    switch (key) {
      case "editProfile":
        router.push("/profile");
        break;
      case "signOut":
        startTransition(async () => {
          await signOut();
        });
        break;
    }
  }

  return (
    <Dropdown.Menu
      className="max-w-[70vw]"
      aria-label="プロフィール"
      onAction={handleProfileMenuAction}
      disabledKeys={isPending ? ["editProfile", "signOut"] : []}
    >
      <Dropdown.Item id="editProfile">
        <Label>プロフィール編集</Label>
      </Dropdown.Item>
      {/* ログアウト完了まで閉じずに処理中を見せる */}
      <Dropdown.Item id="signOut" variant="danger" shouldCloseOnSelect={false}>
        <Label>ログアウト</Label>
        {isPending && <Spinner color="current" size="sm" className="ml-auto" />}
      </Dropdown.Item>
    </Dropdown.Menu>
  );
}
