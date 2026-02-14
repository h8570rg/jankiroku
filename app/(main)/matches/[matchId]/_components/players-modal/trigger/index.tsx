"use client";

import { forwardRef } from "react";
import { useMatchContext } from "../../../context";

export const PlayersModalTrigger = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(function PlayersModalTrigger({ onClick, ...props }, ref) {
  const { open } = useMatchContext().playersModal;

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
