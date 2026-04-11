"use client";

import { useOverlayState } from "@heroui/react";
import { CircleDollarSign } from "lucide-react";
import { Button, type ButtonProps } from "@/components/button";
import type { Match } from "@/lib/type";
import { ChipDrawer } from "../../chip-drawer";

export function EditChipButton({
  match,
  ...buttonProps
}: { match: Match } & ButtonProps) {
  const chipDrawer = useOverlayState();
  return (
    <>
      <Button
        size="md"
        variant="outline"
        onPress={chipDrawer.open}
        {...buttonProps}
      >
        <CircleDollarSign />
        チップを入力する
      </Button>
      <ChipDrawer
        isOpen={chipDrawer.isOpen}
        onOpenChange={chipDrawer.setOpen}
        match={match}
      />
    </>
  );
}
