import { NextResponse } from "next/server";
import { serverServices } from "~/lib/services";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const janrecoId = searchParams.get("janrecoId") || "";
  const { getProfileExists } = serverServices();
  const data = await getProfileExists({ janrecoId });
  return NextResponse.json(data);
}
