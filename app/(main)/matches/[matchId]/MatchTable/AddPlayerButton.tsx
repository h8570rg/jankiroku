"use client";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { useMatchPlayerInputModal } from "../useMatchPlayerInputModal";

export function AddPlayerButton() {
  const matchPlayerInputModal = useMatchPlayerInputModal();

  return (
    <Button
      className="w-full"
      size="sm"
      radius="md"
      variant="solid"
      color="primary"
      isIconOnly
      startContent={<Icon className="size-4 fill-current" name="add" />}
      onClick={matchPlayerInputModal.onOpen}
    >
      追加
    </Button>
  );
}
