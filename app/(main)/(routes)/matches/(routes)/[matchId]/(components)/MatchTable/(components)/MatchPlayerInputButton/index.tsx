"use client";

import { useDisclosure } from "@/components/Modal";

export function MatchPlayerInputButton(
  props: React.ComponentPropsWithoutRef<"button">,
) {
  const gameInputModal = useDisclosure();

  return <button onClick={gameInputModal.onOpen} {...props}></button>;
}
