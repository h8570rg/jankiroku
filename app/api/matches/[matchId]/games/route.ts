import { NextResponse } from "next/server";
import { Rule } from "~/lib/services/match";
import { serverServices } from "~/lib/services/server";

export async function POST(
  request: Request,
  { params: { matchId } }: { params: { matchId: string } },
) {
  const { createGame } = serverServices();
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

export async function GET(
  request: Request,
  { params: { matchId } }: { params: { matchId: string } },
) {
  const { getGames } = serverServices();
  const match = await getGames({ matchId });
  return NextResponse.json(match);
}
