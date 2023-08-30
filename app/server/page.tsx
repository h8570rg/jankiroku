import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

import type { Database } from "~/lib/database.types";

export const dynamic = "force-dynamic";

export default async function ServerComponent() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const user = await supabase.auth.getUser();
  const { data } = await supabase.from("matches").select();
  return (
    <>
      <Link href="/">root</Link>
      <Link href="/client">client</Link>
      <pre>{JSON.stringify(data, null, 2)}</pre>;<p>{user.data.user?.email}</p>
    </>
  );
}
