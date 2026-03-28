"use client";

import { useOverlayState } from "@heroui/react";
import { Button } from "@/components/button";
import type { Profile } from "@/lib/type";
import { CreateMatchDrawer } from "../create-match-drawer";

export function CreateMatchButton({
  className,
  friends,
}: {
  className?: string;
  friends: Profile[];
}) {
  const createMatchDrawer = useOverlayState();

  return (
    <>
      <Button
        className={className}
        size="lg"
        variant="primary"
        onPress={createMatchDrawer.open}
      >
        ゲームを始める
      </Button>
      <CreateMatchDrawer
        isOpen={createMatchDrawer.isOpen}
        onOpenChange={createMatchDrawer.setOpen}
        friends={friends}
      />
    </>
  );
}
