import { NextResponse } from "next/server";
import { services } from "~/lib/services";
import { AddFriendsPayload } from "~/lib/services/friends";
import { createSupabaseClient } from "~/lib/utils/supabase/routeHandlerClient";

export async function GET() {
  const supabaseClient = createSupabaseClient();
  const { getFriends } = services(supabaseClient);
  const data = await getFriends();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabaseClient = createSupabaseClient();
  const { addFriends } = services(supabaseClient);
  const body = (await request.json()) as AddFriendsPayload;
  await addFriends(body);
  return NextResponse.json({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get("profileId");
  if (!profileId) {
    return NextResponse.json({
      error: "profileId is required",
      status: 400,
    });
  }
  const supabaseClient = createSupabaseClient();
  const { deleteFriends } = services(supabaseClient);
  await deleteFriends({ profileId });
  return NextResponse.json({});
}
