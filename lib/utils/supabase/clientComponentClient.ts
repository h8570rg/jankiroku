import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "~/lib/database.types";

// export type Client = ReturnType<typeof createClient>;
export const createSupabaseClient = () =>
  createClientComponentClient<Database>();
