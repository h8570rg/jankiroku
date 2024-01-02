import Link from "next/link";
import { Suspense } from "react";
import Data from "./data";
import User from "./user";

export default async function ServerComponent() {
  return (
    <>
      <Link href="/">root</Link>
      <Link href="/client">client</Link>
      <Suspense fallback={<p>Loading User...</p>}>
        <User />
      </Suspense>
      <Suspense fallback={<p>Loading Data...</p>}>
        <Data />
      </Suspense>
    </>
  );
}
