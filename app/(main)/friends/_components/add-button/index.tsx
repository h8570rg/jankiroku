"use client";

import { PersonPlus } from "@gravity-ui/icons";
import { useState } from "react";
import useSWR from "swr";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/button";
import { Modal, useOverlayState } from "@/components/modal";
import { ScrollShadow } from "@/components/scroll-shadow";
import { SearchField } from "@/components/search-field";
import { User } from "@/components/user";
import { browserServices } from "@/lib/services/browser";
import { AddFriendButton } from "./add-friend-button";

export function AddButton() {
  const addModalState = useOverlayState();
  const [query, setQuery] = useState("");

  const { searchProfiles } = browserServices();

  const { data: profiles, isValidating } = useSWR(
    ["searchProfiles", query],
    () =>
      searchProfiles({
        text: query,
      }),
  );

  const handleSearch = useDebouncedCallback((value: string) => {
    setQuery(value);
  }, 300);

  const handleAddSuccess = () => {
    setQuery("");
    addModalState.close();
  };

  return (
    <>
      <Button variant="ghost" isIconOnly onPress={addModalState.open}>
        <PersonPlus />
      </Button>
      <Modal.Backdrop
        isOpen={addModalState.isOpen}
        onOpenChange={(open) => {
          addModalState.setOpen(open);
          if (!open) setQuery("");
        }}
      >
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>フレンド追加</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="p-1">
              <SearchField
                variant="secondary"
                placeholder="ユーザーIDもしくは名前で検索"
                autoFocus
                onChange={(value) => {
                  handleSearch(value);
                }}
                defaultValue={query}
              />
              <ScrollShadow className="h-[280px] py-1">
                {isValidating && (
                  <li className="flex items-center justify-between py-2">
                    <User skeleton />
                  </li>
                )}
                {!isValidating && !!query && profiles?.length === 0 && (
                  <p className="mt-10 text-center text-sm text-muted">
                    見つかりませんでした
                  </p>
                )}
                {!isValidating &&
                  profiles &&
                  profiles.length > 0 &&
                  profiles?.map(({ id, name, displayId, isFriend }) => (
                    <li
                      key={id}
                      className="flex items-center justify-between py-2"
                    >
                      <User name={name} displayId={displayId} />
                      {isFriend ? (
                        <div className="w-16 text-center text-xs text-muted">
                          追加済み
                        </div>
                      ) : (
                        <AddFriendButton
                          profileId={id}
                          onSuccess={handleAddSuccess}
                        />
                      )}
                    </li>
                  ))}
              </ScrollShadow>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
