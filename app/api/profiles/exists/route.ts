import { NextResponse } from "next/server";
import { services } from "~/lib/services";
import { createSupabaseRouteHandlerClient } from "~/lib/utils/supabase/routeHandlerClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const janrecoId = searchParams.get("janrecoId") || "";
  const supabaseClient = createSupabaseRouteHandlerClient();
  const { getProfileExists } = services(supabaseClient);
  const data = await getProfileExists({ janrecoId });
  return NextResponse.json(data);
}
