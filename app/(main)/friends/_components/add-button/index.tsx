"use client";

import { PersonPlus } from "@gravity-ui/icons";
import { Button } from "@/components/button";
import { useOverlayState } from "@/components/modal";
import { AddFriendModal } from "../add-friend-modal";

export function AddButton() {
  const addModalState = useOverlayState();

  return (
    <>
      <Button variant="ghost" isIconOnly onPress={addModalState.open}>
        <PersonPlus />
      </Button>
      <AddFriendModal
        isOpen={addModalState.isOpen}
        onOpenChange={addModalState.setOpen}
      />
    </>
  );
}
