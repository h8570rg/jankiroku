"use client";

import {
  Button as NextUiButton,
  ButtonGroup,
  ButtonProps,
} from "@nextui-org/react";
import { forwardRef } from "react";
import { useFormStatus } from "react-dom";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ isLoading, ...rest }, ref) {
    const { pending } = useFormStatus();
    return (
      <NextUiButton
        isLoading={isLoading ?? (rest.type === "submit" && pending)}
        {...rest}
        ref={ref}
      />
    );
  },
);

export { ButtonGroup, type ButtonProps };
