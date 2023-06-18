import "server-only";

import { createSupabaseServerClient as createSupabaseClient } from "~/lib/utils/supabase-server";

export const repositories = {
  auth: () => createSupabaseClient().auth,
  matches: () => createSupabaseClient().from("matches"),
};
