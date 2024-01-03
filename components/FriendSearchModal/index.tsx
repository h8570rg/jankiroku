import { debounce } from "lodash-es";
import { ChangeEventHandler, useCallback } from "react";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "~/components/Modal";
import { User } from "~/components/User";
import { useAddFriend } from "~/lib/hooks/api/friends";
import { useProfilesSearch } from "~/lib/hooks/api/profiles";
import { Button } from "../Button";
import { ScrollShadow } from "../ScrollShadow";
import { Skeleton } from "../Skeleton";

// https://nextjs.org/learn/dashboard-app/adding-search-and-pagination

// https://github.com/reactjs/server-components-demo/blob/95fcac10102d20722af60506af3b785b557c5fd7/src/SearchField.js#L29-L37

export function FriendSearchModal({
  isOpen,
  onOpenChange,
  close,
  onClose,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  close: () => void;
  onClose?: () => void;
}) {
  const { data: profiles, trigger, isMutating, reset } = useProfilesSearch();
  const handleChange: ChangeEventHandler<HTMLInputElement> = debounce((e) => {
    const value = e.target.value;
    trigger({ text: value });
  }, 200);

  const handleClose = useCallback(() => {
    reset();
    onClose?.();
  }, [onClose, reset]);

  const handleAdd = useCallback(() => {
    reset();
    close();
  }, [close, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      onClose={handleClose}
    >
      <ModalContent>
        <ModalHeader>フレンド検索</ModalHeader>
        <ModalBody>
          <Input
            placeholder="IDもしくは名前で検索"
            autoFocus
            startContent={
              <Icon className="h-5 w-5 fill-current" name="search" />
            }
            onChange={handleChange}
          />
          <ScrollShadow className="mt-3 h-[280px]">
            <ul className="space-y-2">
              {isMutating && (
                <li className="flex items-center justify-between py-2">
                  <User skeleton />
                  <Skeleton className="rounded-small">
                    <Button color="primary" size="sm">
                      追加
                    </Button>
                  </Skeleton>
                </li>
              )}
              {!isMutating &&
                profiles?.map((profile) => (
                  <ListItem key={profile.id} {...profile} onAdd={handleAdd} />
                ))}
              {!isMutating && profiles && profiles?.length === 0 && (
                <p className="text-center text-small text-foreground-500">
                  見つかりませんでした
                </p>
              )}
            </ul>
          </ScrollShadow>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function ListItem({
  id,
  name,
  janrecoId,
  isFriend,
  onAdd,
}: {
  id: string;
  name: string;
  janrecoId: string;
  isFriend: boolean;
  onAdd: () => void;
}) {
  const { trigger: addFriend, isMutating: isFriendAdding } = useAddFriend();

  const handleAddClick = useCallback(async () => {
    await addFriend({ profileId: id });
    onAdd();
  }, [addFriend, id, onAdd]);

  return (
    <li className="flex items-center justify-between py-2">
      <User name={name} janrecoId={janrecoId} />
      {isFriend ? (
        <div className="w-16 text-center text-tiny text-foreground-500">
          追加済み
        </div>
      ) : (
        <Button
          color="primary"
          size="sm"
          onClick={handleAddClick}
          isLoading={isFriendAdding}
        >
          追加
        </Button>
      )}
    </li>
  );
}
