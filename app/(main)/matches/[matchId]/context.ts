import { createContext, useContext } from "react";
import { UseModalReturn } from "@/components/Modal";

const modalDefaultValue = {
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
  bind: {
    isOpen: false,
    onOpenChange: () => {},
  },
};

export const MatchContext = createContext<{
  playersModal: UseModalReturn;
  gameModal: UseModalReturn;
  chipModal: UseModalReturn;
  ruleModal: UseModalReturn;
  dataModal: UseModalReturn;
}>({
  playersModal: modalDefaultValue,
  gameModal: modalDefaultValue,
  chipModal: modalDefaultValue,
  ruleModal: modalDefaultValue,
  dataModal: modalDefaultValue,
});

export const useMatchContext = () => {
  return useContext(MatchContext);
};
