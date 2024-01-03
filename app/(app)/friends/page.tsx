import Link from "next/link";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { serverServices } from "~/lib/services";
import FriendsList from "./FriendsList";
import { FriendsSearch } from "./FriendsSearch";

export default async function Friends() {
  const { getFriends } = serverServices();
  const friends = await getFriends();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="heading-1">フレンド</h1>
        <Button as={Link} variant="light" isIconOnly href="/friends/add">
          <Icon name="personAdd" className="h-5 w-5 fill-current" />
        </Button>
      </div>
      <FriendsSearch />
      <div className="py-3">
        <FriendsList defaultValue={friends} />
      </div>
    </div>
  );
}
