import { createSupabaseServerClient } from "~/lib/utils/supabase/serverClient";

export default async function User() {
  const supabase = createSupabaseServerClient();
  const user = await supabase.auth.getUser();
  return <div>{user.data.user?.email}</div>;
}
