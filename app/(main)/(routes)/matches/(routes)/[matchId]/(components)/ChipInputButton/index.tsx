"use client";

import { Button, ButtonProps } from "@/components/Button";
import { useChipInputModal } from "../ChipInputModal/hooks";

export function ChipInputButton(props: Omit<ButtonProps, "onClick">) {
  const { onOpen } = useChipInputModal();
  return <Button {...props} onClick={onOpen} />;
}
