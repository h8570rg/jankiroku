import ErrorBoundary from "~/components/ErrorBoundary";
import { useAuthTokenRefresh } from "~/hooks/auth";
import { ToastProvider } from "~/hooks/toast";
import { AppPropsWithLayout } from "~/layout";
import "../styles/globals.css";

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  useAuthTokenRefresh();

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ErrorBoundary>
      <ToastProvider>{getLayout(<Component {...pageProps} />)}</ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
