"use client";

import { useDisclosure, useQueryControlledModal } from "@/components/Modal";
import { MatchContext } from "../../context";

export function MatchContextProvider({
  children,
  playerInputModalDefaultOpen,
}: {
  children: React.ReactNode;
  playerInputModalDefaultOpen: boolean;
}) {
  const playerInputModal = useDisclosure({
    defaultOpen: playerInputModalDefaultOpen,
  });
  const gameInputModal = useDisclosure();
  const chipInputModal = useDisclosure();
  const ruleModal = useDisclosure();
  const dataModal = useQueryControlledModal("data"); // TODO: 使うか検証中

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
