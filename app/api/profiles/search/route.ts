import { NextResponse } from "next/server";
import { serverServices } from "~/lib/services";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text") || "";
  const { searchProfiles } = serverServices();
  const data = await searchProfiles({ text });
  return NextResponse.json(data);
}
