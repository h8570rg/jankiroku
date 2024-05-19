import { User } from "@/components/User";
import { serverServices } from "@/lib/services/server";
import { AddButton } from "./(components)/AddButton";
import { FriendMenu } from "./(components)/FriendMenu";

export default async function FriendsPage() {
  const { getFriends } = serverServices();

  const friends = await getFriends();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="heading-1">フレンド</h1>
        <AddButton />
      </div>
      <ul className="space-y-1">
        {friends?.map((friend) => (
          <li
            className="flex items-center justify-between py-1"
            key={friend.id}
          >
            <User {...friend} />
            <FriendMenu profileId={friend.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
