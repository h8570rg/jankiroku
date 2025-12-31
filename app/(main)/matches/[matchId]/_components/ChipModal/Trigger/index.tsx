"use client";

import { forwardRef } from "react";
import { useMatchContext } from "../../../context";

export const ChipModalTrigger = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(function ChipModalTrigger({ onClick, ...props }, ref) {
  const { onOpen } = useMatchContext().chipModal;

  return (
    <button
      ref={ref}
      onClick={(e) => {
        onOpen();
        onClick?.(e);
      }}
      {...props}
    />
  );
});
