"use client";

import { FriendSearchModal } from "~/components/FriendSearchModal";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "~/components/Modal";
import { ScrollShadow } from "~/components/ScrollShadow";
import { Tab, Tabs } from "~/components/Tabs";
import { User } from "~/components/User";
import { useFriends } from "~/lib/hooks/api/friends";

export function MatchPlayerInputModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const { data: friends } = useFriends();
  const friendsSearchModal = useDisclosure();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
      <ModalContent>
        <ModalHeader>プレイヤー選択</ModalHeader>
        <ModalBody>
          <Tabs fullWidth radius="lg" aria-label="プレイヤー選択の選択肢">
            <Tab key="friends" title="フレンド">
              <ScrollShadow className="h-[200px]">
                <Input
                  placeholder="検索"
                  readOnly
                  onClick={friendsSearchModal.onOpen}
                  startContent={
                    <Icon className="h-5 w-5 fill-current" name="search" />
                  }
                />
                <FriendSearchModal
                  isOpen={friendsSearchModal.isOpen}
                  onOpenChange={friendsSearchModal.onOpenChange}
                  close={friendsSearchModal.onClose}
                />
                <ul className="space-y-2">
                  {friends?.map((friend) => (
                    <li
                      className="flex items-center justify-between py-2"
                      key={friend.id}
                    >
                      <User {...friend} />
                    </li>
                  ))}
                </ul>
              </ScrollShadow>
            </Tab>
            <Tab key="anonymous" title="一般">
              <div className="h-[200px]">いい</div>
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
