import Link from "next/link";

export default function Root() {
  return (
    <>
      <Link href="/login">login</Link>
      <Link href="/server">server</Link>
      <Link href="/client">client</Link>
    </>
  );
}
