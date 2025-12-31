"use client";

import NextLink, { type LinkProps } from "next/link";
import { Button, type ButtonProps } from "@/components/Button";

export type LinkButtonProps = LinkProps & ButtonProps;

export function LinkButton({ children, ...props }: LinkButtonProps) {
  return (
    <Button as={NextLink} {...props}>
      {children}
    </Button>
  );
}
