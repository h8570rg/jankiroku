"use client";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { useDisclosure } from "~/components/Modal";
import { MatchPlayerInputModal } from "./MatchPlayerInputModal";

export function MatchPlayerAddButton() {
  const matchPlayerInputModal = useDisclosure();

  return (
    <>
      <Button
        className="w-full"
        size="sm"
        variant="solid"
        isIconOnly
        startContent={<Icon className="h-4 w-4 fill-current" name="add" />}
        onClick={matchPlayerInputModal.onOpen}
      >
        追加
      </Button>
      <MatchPlayerInputModal
        isOpen={matchPlayerInputModal.isOpen}
        onOpenChange={matchPlayerInputModal.onOpenChange}
      />
    </>
  );
}
