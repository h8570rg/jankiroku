import { NextResponse } from "next/server";
import { serverServices } from "~/lib/services";
import { AddFriendsPayload } from "~/lib/services/friends";

export async function GET() {
  const { getFriends } = serverServices();
  const data = await getFriends();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { addFriends } = serverServices();
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
  const { deleteFriends } = serverServices();
  await deleteFriends({ profileId });
  return NextResponse.json({});
}
