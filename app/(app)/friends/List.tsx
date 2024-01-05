import classNames from "classnames";
import { User } from "~/components/User";
import { serverServices } from "~/lib/services";
import { FriendMenu } from "./FriendMenu";

export async function List({ className }: { className?: string }) {
  const { getFriends } = serverServices();

  const friends = await getFriends();

  return (
    <ul className={classNames(className, "space-y-1")}>
      {friends?.map((friend) => (
        <li className="flex items-center justify-between py-2" key={friend.id}>
          <User {...friend} />
          <FriendMenu profileId={friend.id} />
        </li>
      ))}
    </ul>
  );
}
