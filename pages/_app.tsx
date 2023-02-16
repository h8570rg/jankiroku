import Head from "next/head";
import { AppPropsWithLayout } from "~/lib/layout";
import "~/lib/styles/globals.css";

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>janreco local</title>
      </Head>
      <div>{getLayout(<Component {...pageProps} />)}</div>;
    </>
  );
};

export default App;
