import Head from "next/head";
import { AppPropsWithLayout } from "~/lib/layout";
import "~/lib/styles/globals.css";
import { supabase } from "~/lib/supabaseClient";

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  // TODO
  supabase
    .from("countries")
    .select()
    .then((data) => {
      // eslint-disable-next-line no-console
      console.debug({ data });
    });

  return (
    <>
      <Head>
        <title>janreco local</title>
      </Head>
      <div>{getLayout(<Component {...pageProps} />)}</div>
    </>
  );
};

export default App;
