import Link from "next/link";
import { getURL } from "~/lib/utils/url";

export default function Page() {
  return (
    <>
      <Link href="/login">login</Link>
      <Link href="/server">server</Link>
      <Link href="/client">client</Link>
      <Link href="/register">register</Link>
      <Link href="/matches">matches</Link>
      <p>{getURL()}</p>
    </>
  );
}
