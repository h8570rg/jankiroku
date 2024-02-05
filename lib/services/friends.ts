import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

export function friendsService(supabaseClient: SupabaseClient<Database>) {
  return {
    getFriends: async () => {
      const { data, error } = await supabaseClient.rpc("get_friends");
      if (error) {
        throw error;
      }
      return data.map((friend) => ({
        id: friend.id,
        name: friend.name,
        janrecoId: friend.janreco_id,
      }));
    },

    addFriends: async ({ profileId }: { profileId: string }) => {
      const { error } = await supabaseClient.from("friends").insert({
        profile_id_2: profileId,
      });
      if (error) {
        throw error;
      }
      return;
    },

    deleteFriends: async ({ profileId }: { profileId: string }) => {
      const { error } = await supabaseClient.rpc("delete_friends", {
        profile_id: profileId,
      });
      if (error) {
        throw error;
      }
      return;
    },
  };
}
