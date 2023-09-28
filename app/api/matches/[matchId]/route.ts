import { NextResponse } from "next/server";
import { services } from "~/lib/services";
import { createSupabaseClient } from "~/lib/utils/supabase/routeHandlerClient";

export async function GET(
  request: Request,
  { params: { matchId } }: { params: { matchId: string } },
) {
  const supabaseClient = createSupabaseClient();
  const { getMatch } = services(supabaseClient);
  const data = await getMatch({ matchId });
  return NextResponse.json(data);
}
