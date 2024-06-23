"use client";

import { useChipInputModal } from "../../../ChipInputModal/hooks";

export function ChipInputButton(
  props: React.ComponentPropsWithoutRef<"button">,
) {
  const gameInputModal = useChipInputModal();

  return <button onClick={gameInputModal.onOpen} {...props}></button>;
}
