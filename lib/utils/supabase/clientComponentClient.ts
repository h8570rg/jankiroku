/**
 * @see https://supabase.com/docs/guides/auth/server-side/creating-a-client?environment=client-component
 */
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "~/lib/database.types";

export const createSupabaseClientComponentClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};
