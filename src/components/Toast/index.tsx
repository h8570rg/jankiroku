import Snackbar, { SnackbarProps } from "@mui/material/Snackbar";
import { useCallback, useState } from "react";

type Props = SnackbarProps;

const Toast = (props: Props) => {
  const [open, setOpen] = useState(true);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return <Snackbar {...props} open={open} onClose={onClose} />;
};

export default Toast;
