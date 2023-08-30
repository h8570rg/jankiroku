import "server-only";

import { cookies } from "next/headers";

import { createSupabaseClient } from "~/lib/utils/supabase/serverComponentClient";

export const repositories = {
  auth: () => createSupabaseClient(cookies).auth,
  matches: () => createSupabaseClient(cookies).from("matches"),
};
