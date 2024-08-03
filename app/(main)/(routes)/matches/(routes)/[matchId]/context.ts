import { createContext, useContext } from "react";
import { UseModalReturn } from "@/components/Modal";

const useModalreturnDefaultValue = {
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
  bind: {
    isOpen: false,
    onOpenChange: () => {},
  },
};

export const MatchContext = createContext<{
  playerInputModal: UseModalReturn;
  gameInputModal: UseModalReturn;
  chipInputModal: UseModalReturn;
  ruleModal: UseModalReturn;
  dataModal: UseModalReturn;
}>({
  playerInputModal: useModalreturnDefaultValue,
  gameInputModal: useModalreturnDefaultValue,
  chipInputModal: useModalreturnDefaultValue,
  ruleModal: useModalreturnDefaultValue,
  dataModal: useModalreturnDefaultValue,
});

export const useMatchContext = () => {
  return useContext(MatchContext);
};
