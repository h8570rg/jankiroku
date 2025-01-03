"use client";

import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownItem } from "@/components/Dropdown";
import { signOut } from "./actions";

export function AppbarAvatarMenu({
  name,
  displayId,
}: {
  name: string;
  displayId: string;
}) {
  const router = useRouter();

  function handleProfileMenuAction(key: unknown) {
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
    <DropdownMenu
      className="max-w-[70vw]"
      aria-label="プロフィール"
      variant="flat"
      onAction={handleProfileMenuAction}
    >
      <DropdownItem
        key="profile"
        className="h-14 gap-2"
        textValue={`${name}@${displayId}`}
      >
        <p className="text-wrap break-all">{name}</p>
        <p className="text-wrap break-all">@{displayId}</p>
      </DropdownItem>
      <DropdownItem key="friends">フレンド</DropdownItem>
      <DropdownItem key="signOut" color="danger">
        ログアウト
      </DropdownItem>
    </DropdownMenu>
  );
}
