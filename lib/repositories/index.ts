import "server-only";

import { createSupabaseClient } from "~/lib/utils/supabase/serverComponentClient";

export const repositories = {
  auth: () => createSupabaseClient().auth,
  matches: () => createSupabaseClient().from("matches"),
};
