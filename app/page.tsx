"use client";

import Link from "next/link";
import Router from "next/router";
import { useCallback } from "react";

export default function Home() {
  const handleSignOutClick = useCallback(async () => {
    Router.push("/signin");
  }, []);

  return (
    <>
      <main>
        <Link href="/signin" className="text-blue-900 underline">
          ログイン
        </Link>
        <button onClick={handleSignOutClick}>ログアウト</button>
      </main>
    </>
  );
}
