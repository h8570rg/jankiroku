import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { withAuth } from "~/lib/routes/ssr";
import { signOut } from "~/lib/services/auth";

export const getServerSideProps = withAuth(async (_, user) => {
  return {
    props: {
      user,
    },
  };
});

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Next.js w/ Firebase Client-Side</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Link href="/signin" passHref>
          <a className="text-blue-900 underline">ログイン</a>
        </Link>
        <Link href={"/debug"}>debug page</Link>
        <p>認証情報</p>
        <p>{`uid: ${user.uid}`}</p>
        <button onClick={signOut}>ログアウト</button>
      </main>
    </>
  );
}
