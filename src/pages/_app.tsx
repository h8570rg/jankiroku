import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/500.css";
import "@fontsource/noto-sans-jp/700.css";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import type { AppProps } from "next/app";
import ErrorBoundary from "~/components/ErrorBoundary";
import { useAuthTokenRefresh } from "~/hooks/auth";
import { ToastProvider } from "~/hooks/toast";
import { theme } from "~/styles/theme";
import { NextPageWithLayout } from "~/types";
import "../styles/globals.css";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  useAuthTokenRefresh();

  const component = <Component {...pageProps} />;
  const page = Component.getLayout ? Component.getLayout(component) : component;

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>{page}</ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
