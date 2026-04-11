"use client";

import { useOverlayState } from "@heroui/react";
import { CircleDollarSign } from "lucide-react";
import { Button, type ButtonProps } from "@/components/button";
import type { Match } from "@/lib/type";
import { ChipModal } from "../../chip-modal";

export function EditChipButton({
  match,
  ...buttonProps
}: { match: Match } & ButtonProps) {
  const chipModal = useOverlayState();
  return (
    <>
      <Button
        size="md"
        variant="outline"
        onPress={chipModal.open}
        {...buttonProps}
      >
        <CircleDollarSign />
        チップを入力する
      </Button>
      <ChipModal
        isOpen={chipModal.isOpen}
        onOpenChange={chipModal.setOpen}
        match={match}
      />
    </>
  );
}
