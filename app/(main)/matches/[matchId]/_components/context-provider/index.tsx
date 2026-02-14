"use client";

import { useOverlayState } from "@/components/modal";
import { MatchContext } from "../../context";

export function MatchContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const playersModal = useOverlayState({ defaultOpen: false });
  const gameModal = useOverlayState({ defaultOpen: false });
  const chipModal = useOverlayState({ defaultOpen: false });
  const ruleModal = useOverlayState({ defaultOpen: false });
  const dataModal = useOverlayState({ defaultOpen: false });

  return (
    <MatchContext.Provider
      value={{
        playersModal,
        gameModal,
        chipModal,
        ruleModal,
        dataModal,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
}
