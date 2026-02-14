import { createContext, useContext } from "react";
import type { useOverlayState } from "@/components/modal";

type UseOverlayStateReturn = ReturnType<typeof useOverlayState>;

const modalDefaultValue: UseOverlayStateReturn = {
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
  setOpen: () => {},
};

export const MatchContext = createContext<{
  playersModal: UseOverlayStateReturn;
  gameModal: UseOverlayStateReturn;
  chipModal: UseOverlayStateReturn;
  ruleModal: UseOverlayStateReturn;
  dataModal: UseOverlayStateReturn;
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
