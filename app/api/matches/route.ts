import { NextResponse } from "next/server";

import { services } from "~/lib/services";

export async function GET() {
  const data = await services.matches.get();
  return NextResponse.json(data);
}

export async function POST() {
  const data = await services.matches.create();
  return NextResponse.json(data);
}
