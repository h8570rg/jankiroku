/**
 * @see https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createSupabaseClient } from "~/lib/utils/supabase/routeHandlerClient";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  // eslint-disable-next-line no-console
  console.log("code", code);

  if (code) {
    const supabase = createSupabaseClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}
