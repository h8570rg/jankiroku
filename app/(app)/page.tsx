import Link from "next/link";
import { Button } from "~/components/Button";
import { getURL } from "~/lib/utils/url";
import { signOut } from "./actions";

export default function Page() {
  return (
    <>
      <Link href="/login">login</Link>
      <Link href="/server">server</Link>
      <Link href="/client">client</Link>
      <Link href="/register">register</Link>
      <Link href="/matches">matches</Link>
      <Link href="/friends">friends</Link>
      <p>{getURL()}</p>
      <form action={signOut}>
        <Button type="submit">Sign out</Button>
      </form>
    </>
  );
}
