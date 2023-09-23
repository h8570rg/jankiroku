import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import type { Database } from "~/lib/database.types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const supabase = createRouteHandlerClient<Database>({ cookies });

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
