"use client";

import { useOverlayState } from "@/components/modal";
import type { Match } from "@/lib/type";
import { ChipModal } from "../../chip-modal";

export function ChipRow({
  className,
  style,
  children,
  match,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  match: Match;
}) {
  const chipModal = useOverlayState();

  return (
    <>
      <button
        type="button"
        className={className}
        style={style}
        onClick={chipModal.open}
      >
        {children}
      </button>
      <ChipModal
        isOpen={chipModal.isOpen}
        onOpenChange={chipModal.setOpen}
        match={match}
      />
    </>
  );
}
