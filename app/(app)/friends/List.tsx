import classNames from "classnames";
import { User } from "~/components/User";
import { serverServices } from "~/lib/services";
import { FriendMenu } from "./FriendMenu";

export async function List({
  className,
  skeleton,
}: {
  className?: string;
  skeleton?: boolean;
}) {
  const { getFriends } = serverServices();

  const friends = !skeleton
    ? await getFriends()
    : Array.from({ length: 3 }).map((_, i) => ({
        id: `friends-${i}`,
        name: "",
        janrecoId: "",
        skeleton: true,
      }));

  return (
    <ul className={classNames(className, "space-y-1")}>
      {friends?.map((friend) => (
        <li className="flex items-center justify-between py-2" key={friend.id}>
          <User {...friend} />
          {!skeleton && <FriendMenu profileId={friend.id} />}
        </li>
      ))}
    </ul>
  );
}
