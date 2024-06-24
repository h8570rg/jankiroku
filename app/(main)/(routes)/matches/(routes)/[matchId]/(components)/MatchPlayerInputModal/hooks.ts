import { useQueryControlledModal } from "@/components/Modal";

export const matchPlayerInputModalKey = "player-input";

export const useMatchPlayerInputModal = () => {
  return useQueryControlledModal(matchPlayerInputModalKey);
};
