import { createSupabaseServerClient } from "~/lib/utils/supabase/serverClient";

export default async function Data() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("matches").select();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
