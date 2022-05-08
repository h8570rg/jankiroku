import type { AppProps } from "next/app";
import AuthProvider from "@/context/auth";
import "../styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default App;
