import { NextResponse } from "next/server";
import { services } from "~/lib/services";
import { createSupabaseRouteHandlerClient } from "~/lib/utils/supabase/routeHandlerClient";

export async function GET(
  request: Request,
  { params: { matchId } }: { params: { matchId: string } },
) {
  const supabaseClient = createSupabaseRouteHandlerClient();
  const { getMatch } = services(supabaseClient);
  const data = await getMatch({ matchId });
  return NextResponse.json(data);
}
