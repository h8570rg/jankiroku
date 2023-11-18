import { NextResponse } from "next/server";
import { services } from "~/lib/services";
import { createSupabaseRouteHandlerClient } from "~/lib/utils/supabase/routeHandlerClient";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params: { matchId } }: { params: { matchId: string } },
) {
  const supabaseClient = createSupabaseRouteHandlerClient();
  const { addMatchPlayer } = services(supabaseClient);
  const body = (await request.json()) as { profileId: string };
  await addMatchPlayer({
    matchId,
    profileId: body.profileId,
  });
  return NextResponse.json({});
}
