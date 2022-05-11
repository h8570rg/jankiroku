import { useContext } from "react";
import { ToastContext } from "@/context/toast";

export const useToast = () => {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw Error(
      "`useToast` hook must be called from a descendent of the `ToastProvider`."
    );
  }

  return ctx;
};
