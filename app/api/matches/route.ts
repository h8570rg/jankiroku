import { NextResponse } from "next/server";
import { services } from "~/lib/services";
import { CreateMatchPayload } from "~/lib/services/matches";
import { createSupabaseRouteHandlerClient } from "~/lib/utils/supabase/routeHandlerClient";

export async function GET() {
  const supabaseClient = createSupabaseRouteHandlerClient();
  const { getMatches } = services(supabaseClient);
  const data = await getMatches();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabaseClient = createSupabaseRouteHandlerClient();
  const { createMatch } = services(supabaseClient);
  const body = (await request.json()) as CreateMatchPayload;
  const data = await createMatch(body);
  return NextResponse.json(data);
}
