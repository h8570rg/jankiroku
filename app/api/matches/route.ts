import { NextResponse } from "next/server";

import {
  CreateMatchPaylead,
  createMatch,
  getMatches,
} from "~/lib/services/matches";

export async function GET() {
  const data = await getMatches();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateMatchPaylead;
  await createMatch(body);
  return NextResponse.json({});
}
