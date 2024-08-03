"use client";

import { forwardRef } from "react";
import { useMatchContext } from "../../context";

export const RuleModalTrigger = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(function DataModalTrigger({ onClick, ...props }, ref) {
  const { onOpen } = useMatchContext().ruleModal;

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
