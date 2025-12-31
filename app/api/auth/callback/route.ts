import { NextResponse } from "next/server";
import { serverServices } from "@/lib/services/server";
import { createClient } from "@/lib/supabase/server";

/**
 * @see https://supabase.com/docs/guides/auth/server-side/oauth-with-pkce-flow-for-ssr
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { getUserProfile } = await serverServices();
      const profile = await getUserProfile();
      if (profile.isUnregistered) {
        return NextResponse.redirect(`${origin}/register`);
      }
      return NextResponse.redirect(`${origin}${next}/matches`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth-code-error`);
}
