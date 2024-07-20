"use client";

import { Button, ButtonProps } from "@/components/Button";
import { useMatchContext } from "../../context";

export function ChipInputButton(props: Omit<ButtonProps, "onClick">) {
  const { onOpen } = useMatchContext().chipInputModal;
  return <Button {...props} onClick={onOpen} />;
}
