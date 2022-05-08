import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import type { AppProps } from "next/app";
import AuthProvider from "@/context/auth";
import "../styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <CssBaseline />
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
};

export default App;
