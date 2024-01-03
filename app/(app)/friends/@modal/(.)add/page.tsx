"use client";

import { useRouter } from "next/navigation";
import { FriendSearchModal } from "~/components/FriendSearchModal";
import { useDisclosure } from "~/components/Modal";

export default function Modal() {
  const router = useRouter();
  const friendsSearchModal = useDisclosure({
    defaultOpen: true,
  });

  return (
    <FriendSearchModal
      isOpen={friendsSearchModal.isOpen}
      onOpenChange={friendsSearchModal.onOpenChange}
      close={friendsSearchModal.onClose}
      onClose={() => {
        // TODO: view transition api を使用し、ブラウザバックでアニメーションを実現する
        setTimeout(() => {
          router.back();
        }, 400);
      }}
    />
  );
}
