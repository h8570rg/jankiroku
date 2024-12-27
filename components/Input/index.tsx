"use client";

import { Input as NextUiInput, InputProps } from "@nextui-org/react";
import { forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  Omit<InputProps, "isInvalid">
>(function Input(props, ref) {
  return <NextUiInput {...props} ref={ref} isInvalid={!!props.errorMessage} />;
});
