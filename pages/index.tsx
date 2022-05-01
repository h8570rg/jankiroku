import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/context/auth";

export default function Home() {
  const { loadingUser, user, signOut, signedIn } = useAuth();
  const profile = { username: "nextjs_user", message: "Awesome!!" };

  return (
    <>
      <Head>
        <title>Next.js w/ Firebase Client-Side</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Link href={`/profile/${profile.username}`} passHref>
          <a className="text-blue-900 underline">Go to SSR Page</a>
        </Link>
        <Link href="/signin" passHref>
          <a className="text-blue-900 underline">ログイン</a>
        </Link>
        <div className="mt-5">
          <p>{`ログイン状態: ${signedIn}`}</p>
          <p className="">{`loadingUser: ${loadingUser}`}</p>
          <p className="break-all">{`user: ${JSON.stringify(user)}`}</p>
        </div>
        <button onClick={signOut}>ログアウト</button>
      </main>
    </>
  );
}
