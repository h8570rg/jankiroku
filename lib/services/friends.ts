import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../database.types";

export type Friend = {
  id: string;
  name: string;
  janrecoId: string;
};

export type AddFriendsPayload = {
  profileId: string;
};

export type DeleteFriendsPayload = {
  profileId: string;
};

export function friendsService(supabaseClient: SupabaseClient<Database>) {
  return {
    getFriends: async (): Promise<Friend[]> => {
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

    addFriends: async ({ profileId }: AddFriendsPayload) => {
      const { error } = await supabaseClient.from("friends").insert({
        profile_id_2: profileId,
      });
      if (error) {
        throw error;
      }
      return;
    },

    deleteFriends: async ({ profileId }: DeleteFriendsPayload) => {
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
