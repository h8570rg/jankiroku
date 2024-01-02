import { serverServices } from "~/lib/services";
import FriendsList from "./FriendsList";
import { FriendsSearch } from "./FriendsSearch";

export default async function Friends() {
  const { getFriends } = serverServices();
  const friends = await getFriends();

  return (
    <div>
      <h1 className="heading-1 mb-4">フレンド</h1>
      <FriendsSearch />
      <div className="py-3">
        <FriendsList defaultValue={friends} />
      </div>
    </div>
  );
}
