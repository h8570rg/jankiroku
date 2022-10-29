import { useCallback, useState } from "react";

const Toast = ({ message }: { message: string }) => {
  const [open, setOpen] = useState(true);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return <div>{message}</div>;
};

export default Toast;
