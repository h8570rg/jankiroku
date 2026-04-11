"use client";

import { Drawer } from "@heroui/react";
import type { Match } from "@/lib/type";
import { ChipForm } from "./chip-form";

export type ChipDrawerProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  match: Match;
};

export function ChipDrawer({ isOpen, onOpenChange, match }: ChipDrawerProps) {
  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content placement="bottom">
        <Drawer.Dialog>
          <Drawer.Header>
            <Drawer.Heading>チップ入力</Drawer.Heading>
          </Drawer.Header>
          <ChipForm match={match} onOpenChange={onOpenChange} />
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}
