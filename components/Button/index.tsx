"use client";

import {
  Button as NextUiButton,
  ButtonGroup,
  ButtonProps,
} from "@nextui-org/react";
import { useFormStatus } from "react-dom";

export function Button({ isLoading, ...rest }: ButtonProps) {
  const { pending } = useFormStatus();
  return <NextUiButton isLoading={isLoading || pending} {...rest} />;
}

export { ButtonGroup };
