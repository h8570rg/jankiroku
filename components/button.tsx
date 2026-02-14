"use client";

import {
  ButtonGroup,
  buttonVariants,
  Button as HeroUiButton,
  type ButtonProps as HeroUiButtonProps,
  Spinner,
} from "@heroui/react";

export type ButtonProps = HeroUiButtonProps;

export function Button({ children, ...props }: ButtonProps) {
  return (
    <HeroUiButton {...props}>
      {({ isPending }) => (
        <>
          {isPending ? <Spinner color="current" size="sm" /> : null}
          {children}
        </>
      )}
    </HeroUiButton>
  );
}

export { ButtonGroup, buttonVariants };
