/**
 * @see https://supabase.com/docs/guides/auth/server-side/creating-a-client?environment=server-component
 * @see https://supabase.com/docs/guides/auth/server-side/email-based-auth-with-pkce-flow-for-ssr
 */
import { CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "~/lib/database.types";

/**
 * @deprecated
 * TODO: 消す
 */
export const createSupabaseServerComponentClient = () => {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options });
        },
      },
    },
  );
};
