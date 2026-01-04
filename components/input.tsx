"use client";

import { cn, Input as HeroUiInput, type InputProps } from "@heroui/react";
import { forwardRef } from "react";
// import { cn } from "tailwind-variants";

export const Input = forwardRef<
  HTMLInputElement,
  Omit<InputProps, "isInvalid">
>(function Input({ classNames: propsClassNames, ...props }, ref) {
  return (
    <HeroUiInput
      classNames={{
        ...propsClassNames,
        input: cn("text-base", propsClassNames?.input), // ios safariで拡大されるのを防ぐ
      }}
      {...props}
      ref={ref}
      isInvalid={!!props.errorMessage}
    />
  );
});
