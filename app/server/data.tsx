import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "~/lib/database.types";

export default async function Data() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data } = await supabase.from("matches").select();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
