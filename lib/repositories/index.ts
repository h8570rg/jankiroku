import "server-only";

import { cookies } from "next/headers";

import { createSupabaseClient } from "~/lib/utils/supabase/routeHandlerClient";

export const repositories = {
  matches: () => createSupabaseClient(cookies).from("matches"),
  rules: () => createSupabaseClient(cookies).from("rules"),
};
