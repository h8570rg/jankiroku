/**
 * @see https://supabase.com/docs/guides/auth/server-side/creating-a-client
 */
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "~/lib/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
