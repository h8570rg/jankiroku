"use client";

import { useModal } from "@/components/Modal";

export function MatchPlayerInputButton(
  props: React.ComponentPropsWithoutRef<"button">,
) {
  const gameInputModal = useModal();

  return <button onClick={gameInputModal.onOpen} {...props}></button>;
}
