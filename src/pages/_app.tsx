import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import ErrorBoundary from "~/components/ErrorBoundary";
import { useAuthTokenRefresh } from "~/hooks/auth";
import { ToastProvider } from "~/hooks/toast";
import { AppPropsWithLayout } from "~/layout";
import { theme } from "~/styles/theme";
import "../styles/globals.css";

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  useAuthTokenRefresh();

  const getLayout = Component.getLayout ?? ((page) => page);

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
