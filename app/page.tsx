import Link from "next/link";

import { Debug } from "~/components/Debug";

export default function Home() {
  return (
    <>
      <main>
        <Link href="/signin" className="text-blue-900 underline">
          ログイン
        </Link>
        <Debug></Debug>
      </main>
    </>
  );
}
