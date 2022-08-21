import { useRouter } from "next/router";
import { ReactNode } from "react";
import AppBar from "~/components/AppBar";
import { IconButton } from "~/components/Button";
import Icon from "~/components/Icon";

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
