import { Profile } from "@/lib/type";
import { Supabase } from ".";

export function friendService(supabase: Supabase) {
  return {
    async getFriends(): Promise<Profile[]> {
      const friendsResponse = await supabase
        .from("friends")
        .select("*, profiles!public_friends_friend_id_fkey!inner(*)");
      if (friendsResponse.error) throw friendsResponse.error;
      const friends = friendsResponse.data;

      return friends.map((friend) => ({
        id: friend.profiles.id,
        name: friend.profiles.name,
        janrecoId: friend.profiles.janreco_id,
      }));
    },

    async addFriends({ profileId }: { profileId: string }): Promise<Profile> {
      const friendResponse = await supabase
        .from("friends")
        .insert({
          friend_id: profileId,
        })
        .select("*, profiles!public_friends_friend_id_fkey!inner(*)")
        .single();
      if (friendResponse.error) throw friendResponse.error;
      const friend = friendResponse.data;

      return {
        id: friend.profiles.id,
        name: friend.profiles.name,
        janrecoId: friend.profiles.janreco_id,
      };
    },

    async deleteFriends({ profileId }: { profileId: string }): Promise<void> {
      const userResponse = await supabase.auth.getUser();
      if (userResponse.error) throw userResponse.error;
      const user = userResponse.data.user;

      const [userFriendResponse, friendUserResponse] = await Promise.all([
        supabase
          .from("friends")
          .delete()
          .eq("friend_id", profileId)
          .eq("profile_id", user.id),
        supabase
          .from("friends")
          .delete()
          .eq("friend_id", user.id)
          .eq("profile_id", profileId),
      ]);
      if (userFriendResponse.error) throw userFriendResponse.error;
      if (friendUserResponse.error) throw friendUserResponse.error;

      return;
    },
  };
}
