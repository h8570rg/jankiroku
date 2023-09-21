import "server-only";

import { createSupabaseClient } from "~/lib/utils/supabase/routeHandlerClient";

export const repositories = {
  matches: () => createSupabaseClient().from("matches"),
  rules: () => createSupabaseClient().from("rules"),
};
