import { getFriends } from "@/lib/data/friend";
import { FriendsList } from "./_components/friends-list";

export default async function FriendsPage() {
  const friends = await getFriends();

  return <FriendsList friends={friends} />;
}
