import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "~/lib/database.types";

export const createSupabaseClient = () =>
  createClientComponentClient<Database>();
