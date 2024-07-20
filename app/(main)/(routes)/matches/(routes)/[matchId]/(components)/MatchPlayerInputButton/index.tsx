"use client";

import { Button, ButtonProps } from "@/components/Button";
import { useDisclosure } from "@/components/Modal";

export function MatchPlayerInputButton(props: Omit<ButtonProps, "onClick">) {
  const { onOpen } = useDisclosure();
  return <Button {...props} onClick={onOpen} />;
}
