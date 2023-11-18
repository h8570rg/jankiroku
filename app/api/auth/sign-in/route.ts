import { NextRequest } from "next/server";
import { createSupabaseRouteHandlerClient } from "~/lib/utils/supabase/routeHandlerClient";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const supabase = createSupabaseRouteHandlerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new Response(error.message, {
      status: error.status,
    });
  }

  return new Response(null, {
    status: 200,
  });
}
