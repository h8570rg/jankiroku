import { createSupabaseServerComponentClient } from "~/lib/utils/supabase/serverComponentClient";

export default async function User() {
  const supabase = createSupabaseServerComponentClient();
  const user = await supabase.auth.getUser();
  return <div>{user.data.user?.email}</div>;
}
