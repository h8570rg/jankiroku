import { NextResponse } from "next/server";
import { serverServices } from "~/lib/services";
import { UpdateProfilePayload } from "~/lib/services/profile";

export async function POST(
  request: Request,
  { params: { profileId } }: { params: { profileId: string } },
) {
  const { updateProfile } = serverServices();
  const body = (await request.json()) as { name: string; janrecoId: string };
  const payload: UpdateProfilePayload = {
    id: profileId,
    name: body.name,
    janrecoId: body.janrecoId,
  };
  await updateProfile(payload);
  return NextResponse.json({});
}
