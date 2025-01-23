"use client";

import { Input as HeroUiInput, InputProps } from "@heroui/react";
import classNames from "classnames";
import { forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  Omit<InputProps, "isInvalid">
>(function Input({ classNames: propsClassNames, ...props }, ref) {
  return (
    <HeroUiInput
      classNames={{
        ...propsClassNames,
        input: classNames("text-medium", propsClassNames?.input), // ios safariで拡大されるのを防ぐ
      }}
      {...props}
      ref={ref}
      isInvalid={!!props.errorMessage}
    />
  );
});
