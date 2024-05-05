import { Supabase } from ".";

export function friendsService(supabase: Supabase) {
  return {
    getFriends: async () => {
      // TODO: user 取得はpageでやったほうがいいかも
      const user = await supabase.auth.getUser();
      if (user.error) throw user.error;
      const { data, error } = await supabase
        .from("friends")
        .select("*, profiles!public_friends_friend_id_fkey!inner(*)");
      // .eq("profile_id", user.data.user.id); // TODO: policyあるからいらないかも
      if (error) throw error;

      return data.map((friend) => ({
        id: friend.profiles.id,
        name: friend.profiles.name!,
        janrecoId: friend.profiles.janreco_id!,
      }));
    },

    addFriends: async ({ profileId }: { profileId: string }) => {
      const { error } = await supabase.from("friends").insert({
        friend_id: profileId,
      });
      if (error) throw error;
      return;
    },

    deleteFriends: async ({ profileId }: { profileId: string }) => {
      const user = await supabase.auth.getUser();
      if (user.error) throw user.error;
      const [{ error: error1 }, { error: error2 }] = await Promise.all([
        supabase
          .from("friends")
          .delete()
          .eq("friend_id", profileId)
          .eq("profile_id", user.data.user.id),
        supabase
          .from("friends")
          .delete()
          .eq("friend_id", user.data.user.id)
          .eq("profile_id", profileId),
      ]);

      if (error1) throw error1;
      if (error2) throw error2;
      return;
    },
  };
}
