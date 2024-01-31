import { NextResponse } from "next/server";
import { serverServices } from "~/lib/services/server";

export async function POST(
  request: Request,
  { params: { matchId } }: { params: { matchId: string } },
) {
  const { addMatchPlayer } = serverServices();
  const body = (await request.json()) as { profileId: string };
  await addMatchPlayer({
    matchId,
    profileId: body.profileId,
  });
  return NextResponse.json({});
}
