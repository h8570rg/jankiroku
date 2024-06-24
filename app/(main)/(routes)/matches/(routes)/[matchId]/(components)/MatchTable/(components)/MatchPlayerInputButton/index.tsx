"use client";

import { useMatchPlayerInputModal } from "../../../MatchPlayerInputModal/hooks";

export function MatchPlayerInputButton(
  props: React.ComponentPropsWithoutRef<"button">,
) {
  const gameInputModal = useMatchPlayerInputModal();

  return <button onClick={gameInputModal.onOpen} {...props}></button>;
}
