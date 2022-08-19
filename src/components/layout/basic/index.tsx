import { useRouter } from "next/router";
import { ReactNode } from "react";
import AppBar from "@components/appBar";
import { IconButton } from "@components/button";
import Icon from "@components/icon";

const BasicLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  return (
    <>
      <AppBar>
        <IconButton onClick={router.back}>
          <Icon name="back" />
        </IconButton>
      </AppBar>
      {children}
    </>
  );
};

export default BasicLayout;
