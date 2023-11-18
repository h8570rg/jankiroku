import { services } from "~/lib/services";
import { createSupabaseServerComponentClient } from "~/lib/utils/supabase/serverComponentClient";
import FriendsList from "./FriendsList";
import { FriendsSearch } from "./FriendsSearch";

export default async function Friends() {
  const supabaseClient = createSupabaseServerComponentClient();
  const { getFriends } = services(supabaseClient);
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
