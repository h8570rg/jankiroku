"use client";

import { useMatchContext } from "../../../../context";

export function ChipInputButton(
  props: React.ComponentPropsWithoutRef<"button">,
) {
  const { gameInputModal } = useMatchContext();

  return <button onClick={gameInputModal.onOpen} {...props}></button>;
}
