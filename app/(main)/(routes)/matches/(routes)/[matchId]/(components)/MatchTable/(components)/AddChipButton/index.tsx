"use client";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { useChipInputModal } from "../../../ChipInputModal/hooks";

export function AddChipButton({ isDisabled }: { isDisabled: boolean }) {
  const gameInputModal = useChipInputModal();

  return (
    <Button
      fullWidth
      onClick={gameInputModal.onOpen}
      isDisabled={isDisabled}
      startContent={<Icon className="size-4" name="chip" />}
    >
      チップを入力する
    </Button>
  );
}
