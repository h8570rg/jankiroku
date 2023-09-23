import { NextResponse } from "next/server";
import { services } from "~/lib/services";
import { UpdateProfilePayload } from "~/lib/services/profile";
import { createSupabaseClient } from "~/lib/utils/supabase/routeHandlerClient";

export async function POST(
  request: Request,
  { params: { profileId } }: { params: { profileId: string } },
) {
  const supabaseClient = createSupabaseClient();
  const { updateProfile } = services(supabaseClient);
  const body = (await request.json()) as { name: string; janrecoId: string };
  const payload: UpdateProfilePayload = {
    id: profileId,
    name: body.name,
    janrecoId: body.janrecoId,
  };
  await updateProfile(payload);
  return NextResponse.json({});
}
