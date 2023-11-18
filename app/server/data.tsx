import { createSupabaseServerComponentClient } from "~/lib/utils/supabase/serverComponentClient";

export default async function Data() {
  const supabase = createSupabaseServerComponentClient();
  const { data } = await supabase.from("matches").select();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
