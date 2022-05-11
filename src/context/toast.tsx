import React, { createContext, ReactNode, useCallback, useState } from "react";
import Toast from "@/components/toast";

type ToastContent = string;
type Toast = {
  content: ToastContent;
};
type ToastContext = {
  add: AddToast;
};
type AddToast = ({ content }: { content: ToastContent }) => void;

export const ToastContext = createContext<ToastContext>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  add: () => {},
});

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback<AddToast>(({ content }) => {
    const newToast: Toast = {
      content,
    };
    setToasts((toasts) => [...toasts, newToast]);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        add,
      }}
    >
      {children}
      {toasts.map((toast, idx) => (
        <Toast message={toast.content} key={idx} autoHideDuration={3000} />
      ))}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
