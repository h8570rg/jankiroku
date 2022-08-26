import AppBar from "~/components/AppBar";
import { GetLayout } from "..";

const BasicLayout: GetLayout = (page) => {
  return (
    <>
      <AppBar>a</AppBar>
      {page}
    </>
  );
};

export default BasicLayout;
