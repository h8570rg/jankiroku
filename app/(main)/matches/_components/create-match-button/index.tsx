"use client";

import { useOverlayState } from "@heroui/react";
import { Button } from "@/components/button";
import { CreateMatchModal } from "../create-match-modal";

export function CreateMatchButton({ className }: { className?: string }) {
  const ruleCreateModal = useOverlayState();

  return (
    <>
      <Button
        className={className}
        size="lg"
        variant="primary"
        onPress={ruleCreateModal.open}
      >
        ゲームを始める
      </Button>
      <CreateMatchModal
        isOpen={ruleCreateModal.isOpen}
        onOpenChange={ruleCreateModal.setOpen}
      />
    </>
  );
}
