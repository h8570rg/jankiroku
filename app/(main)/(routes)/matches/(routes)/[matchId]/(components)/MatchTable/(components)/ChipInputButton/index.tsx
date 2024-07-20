"use client";

import { useMatchContext } from "../../../../context";

export function ChipInputButton(
  props: React.ComponentPropsWithoutRef<"button">,
) {
  const { chipInputModal } = useMatchContext();

  return <button onClick={chipInputModal.onOpen} {...props}></button>;
}
