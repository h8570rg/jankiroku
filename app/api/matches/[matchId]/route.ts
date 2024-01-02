import { NextResponse } from "next/server";
import { serverServices } from "~/lib/services";

export async function GET(
  request: Request,
  { params: { matchId } }: { params: { matchId: string } },
) {
  const { getMatch } = serverServices();
  const data = await getMatch({ matchId });
  return NextResponse.json(data);
}
