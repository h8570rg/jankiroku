import ErrorBoundary from "~/components/ErrorBoundary";
import { useAuthTokenRefresh } from "~/lib/hooks/auth";
import { ToastProvider } from "~/lib/hooks/toast";
import { AppPropsWithLayout } from "~/lib/layout";
import "~/lib/styles/globals.css";

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
