import { NextResponse } from "next/server";
import { serverServices } from "~/lib/services/server";

export async function POST(request: Request) {
  const { createProfile } = serverServices();
  const body = (await request.json()) as {
    name: string;
  };
  const data = await createProfile(body);
  return NextResponse.json(data);
}
