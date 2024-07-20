"use client";

import { Button, ButtonProps } from "@/components/Button";
import { useMatchContext } from "../../context";

export function MatchPlayerInputButton(props: Omit<ButtonProps, "onClick">) {
  const { onOpen } = useMatchContext().playerInputModal;

  return <Button {...props} onClick={onOpen} />;
}
