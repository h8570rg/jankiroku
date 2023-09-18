import Link from "next/link";

import { getURL } from "~/lib/utils/url";

export default function Root() {
  return (
    <>
      <Link href="/login">login</Link>
      <Link href="/server">server</Link>
      <Link href="/client">client</Link>
      <p>{getURL()}</p>
    </>
  );
}
