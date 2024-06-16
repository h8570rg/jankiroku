"use client";

import { Button, ButtonProps } from "@/components/Button";
import { useMatchPlayerInputModal } from "../MatchPlayerInputModal/hooks";

export function MatchPlayerInputButton(props: Omit<ButtonProps, "onClick">) {
  const { onOpen } = useMatchPlayerInputModal();
  return <Button {...props} onClick={onOpen} />;
}
