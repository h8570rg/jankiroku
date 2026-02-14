"use client";

import { forwardRef } from "react";
import { useMatchContext } from "../../../context";

export const DataModalTrigger = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(function DataModalTrigger({ onClick, ...props }, ref) {
  const { open } = useMatchContext().dataModal;

  return (
    <button
      ref={ref}
      onClick={(e) => {
        open();
        onClick?.(e);
      }}
      {...props}
    />
  );
});
