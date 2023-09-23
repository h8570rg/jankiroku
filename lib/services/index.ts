import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "~/lib/database.types";
import { matchService } from "./match";
import { matchesService } from "./matches";

export const services = (supabaseClient: SupabaseClient<Database>) => {
  return {
    ...matchesService(supabaseClient),
    ...matchService(supabaseClient),
  };
};
