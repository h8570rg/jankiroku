"use client";

import { useModal } from "@/components/Modal";
import { MatchContext } from "../../context";

export function MatchContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const playerInputModal = useModal();
  const gameInputModal = useModal();
  const chipInputModal = useModal();
  const ruleModal = useModal();
  const dataModal = useModal();

  return (
    <MatchContext.Provider
      value={{
        playerInputModal,
        gameInputModal,
        chipInputModal,
        ruleModal,
        dataModal,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
}
