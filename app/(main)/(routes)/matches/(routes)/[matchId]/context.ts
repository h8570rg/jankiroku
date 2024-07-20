import { createContext, useContext } from "react";

export const MatchContext = createContext<{
  playerInputModal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  gameInputModal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  chipInputModal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  ruleModal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
}>({
  playerInputModal: {
    isOpen: false,
    onOpen: () => {},
    onClose: () => {},
  },
  gameInputModal: {
    isOpen: false,
    onOpen: () => {},
    onClose: () => {},
  },
  chipInputModal: {
    isOpen: false,
    onOpen: () => {},
    onClose: () => {},
  },
  ruleModal: {
    isOpen: false,
    onOpen: () => {},
    onClose: () => {},
  },
});

export const useMatchContext = () => {
  return useContext(MatchContext);
};
