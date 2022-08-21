import LoadingButton from "@mui/lab/LoadingButton";
import IconButtonMui, { IconButtonProps } from "@mui/material/IconButton";

export const IconButton = ({ ...iconButtonProps }: IconButtonProps) => {
  return <IconButtonMui color="inherit" {...iconButtonProps} />;
};

export default LoadingButton;
