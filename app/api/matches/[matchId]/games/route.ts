import { NextResponse } from "next/server";
import { services } from "~/lib/services";
import { Rule } from "~/lib/services/match";
import { createSupabaseClient } from "~/lib/utils/supabase/routeHandlerClient";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params: { matchId } }: { params: { matchId: string } },
) {
  const supabaseClient = createSupabaseClient();
  const { createGame } = services(supabaseClient);
  const body = (await request.json()) as {
    playerPoints: {
      profileId: string;
      points: number;
    }[];
    rule: Rule;
    crackBoxPlayerId?: string;
  };
  await createGame({
    matchId,
    ...body,
  });
  return NextResponse.json({});
}
