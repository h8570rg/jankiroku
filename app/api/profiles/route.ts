import { NextResponse } from "next/server";
import { services } from "~/lib/services";
import { createSupabaseClient } from "~/lib/utils/supabase/routeHandlerClient";

export async function POST(request: Request) {
  const supabaseClient = createSupabaseClient();
  const { createProfile } = services(supabaseClient);
  const body = (await request.json()) as {
    name: string;
  };
  const data = await createProfile(body);
  return NextResponse.json(data);
}
