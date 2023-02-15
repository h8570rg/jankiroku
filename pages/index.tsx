import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useCallback } from "react";
// import { withUser } from "~/lib/routes/ssr";

// export const getServerSideProps = withUser(async (_, { user }) => {
//   return {
//     props: {
//       user,
//     },
//   };
// });

export default function Home() {
  const handleSignOutClick = useCallback(async () => {
    Router.push("/signin");
  }, []);
  return (
    <>
      <Head>
        <title>Next.js w/ Firebase Client-Side</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Link href="/signin" className="text-blue-900 underline">
          ログイン
        </Link>
        <Link href={"/debug"}>debug page</Link>
        <p>認証情報</p>
        {/* <p>{`uid: ${user.uid}`}</p> */}
        <button onClick={handleSignOutClick}>ログアウト</button>
      </main>
    </>
  );
}
