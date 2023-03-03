import Link from "next/link";

export default function Home() {
  return (
    <>
      <main>
        <Link href="/signin" className="text-blue-900 underline">
          ログイン
        </Link>
      </main>
    </>
  );
}
