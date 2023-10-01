import { NextResponse } from "next/server";
import { services } from "~/lib/services";
import { createSupabaseClient } from "~/lib/utils/supabase/routeHandlerClient";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params: { matchId } }: { params: { matchId: string } },
) {
  const supabaseClient = createSupabaseClient();
  const { addMatchPlayer } = services(supabaseClient);
  const body = (await request.json()) as { profileId: string };
  const data = await addMatchPlayer({
    matchId,
    profileId: body.profileId,
  });
  return NextResponse.json(data);
}
