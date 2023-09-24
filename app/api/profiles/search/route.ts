import { NextResponse } from "next/server";
import { services } from "~/lib/services";
import { createSupabaseClient } from "~/lib/utils/supabase/routeHandlerClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text") || "";
  const supabaseClient = createSupabaseClient();
  const { searchProfiles } = services(supabaseClient);
  const data = await searchProfiles({ text });
  return NextResponse.json(data);
}
