import AppBarMui, { AppBarProps as AppBarMuiProps } from "@mui/material/AppBar";
import ToolbarMui from "@mui/material/Toolbar";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
} & AppBarMuiProps;

const AppBar = ({ children, ...appBarMuiProps }: Props) => {
  return (
    <AppBarMui position="static" {...appBarMuiProps}>
      <ToolbarMui>{children}</ToolbarMui>
    </AppBarMui>
  );
};

export default AppBar;
