import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import type { AppProps } from "next/app";
import { NextPageWithLayout } from "@types";
import ErrorBoundary from "@components/ErrorBoundary";
import BasicLayout from "@components/layout/basic";
import { useAuthTokenRefresh } from "@hooks/auth";
import { ToastProvider } from "@hooks/toast";
import { theme } from "~/styles/theme";
import "../styles/globals.css";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  useAuthTokenRefresh();
  const getLayout =
    Component.getLayout || ((page) => <BasicLayout>{page}</BasicLayout>);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>{getLayout(<Component {...pageProps} />)}</ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
