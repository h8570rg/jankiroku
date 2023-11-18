import { createSupabaseRouteHandlerClient } from "~/lib/utils/supabase/routeHandlerClient";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const supabase = createSupabaseRouteHandlerClient();

  const { error } = await supabase.auth.signUp({
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
