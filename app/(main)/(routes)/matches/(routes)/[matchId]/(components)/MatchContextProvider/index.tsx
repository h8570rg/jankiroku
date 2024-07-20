"use client";

import { useDisclosure } from "@/components/Modal";
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

  return (
    <MatchContext.Provider
      value={{ playerInputModal, gameInputModal, chipInputModal, ruleModal }}
    >
      {children}
    </MatchContext.Provider>
  );
}
