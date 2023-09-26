"use client";

import { FriendSearchModal } from "~/components/FriendSearchModal";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { useDisclosure } from "~/components/Modal";

export function FriendsSearch() {
  const friendsSearchModal = useDisclosure();

  return (
    <>
      <Input
        placeholder="検索"
        readOnly
        onClick={friendsSearchModal.onOpen}
        startContent={<Icon className="h-5 w-5 fill-current" name="search" />}
      />
      <FriendSearchModal
        isOpen={friendsSearchModal.isOpen}
        onOpenChange={friendsSearchModal.onOpenChange}
        close={friendsSearchModal.onClose}
      />
    </>
  );
}
