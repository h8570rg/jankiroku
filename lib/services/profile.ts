import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "~/lib/database.types";

export type UnregisteredProfile = {
  id: string;
  name: string | null;
  janrecoId: string | null;
};

export type Profile = {
  id: string;
  name: string;
  janrecoId: string;
  isFriend: boolean;
};

export type AnonymousProfile = {
  id: string;
  name: string;
};

export function profileService(supabaseClient: SupabaseClient<Database>) {
  return {
    getUserProfile: async () => {
      const getUserResult = await supabaseClient.auth.getUser();
      if (getUserResult.error) {
        throw getUserResult.error;
      }
      if (!getUserResult.data.user) {
        throw new Error("User not found");
      }

      const { user } = getUserResult.data;

      const { data, error } = await supabaseClient
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single();
      if (error) {
        throw error;
      }

      const isUnregistered = !data.name || !data.janreco_id;

      return {
        id: data.id,
        name: data.name,
        janrecoId: data.janreco_id,
        isUnregistered,
        isAnonymous: user.is_anonymous,
      };
    },

    updateProfile: async ({
      userId,
      name,
      janrecoId,
    }: {
      userId: string;
      name: string;
      janrecoId: string;
    }) => {
      const { error } = await supabaseClient
        .from("profiles")
        .update({ name, janreco_id: janrecoId })
        .eq("id", userId);
      if (error) {
        throw error;
      }
    },

    /**
     * @see https://github.com/supabase/postgrest-js/issues/289
     */
    searchProfiles: async ({ text }: { text: string }): Promise<Profile[]> => {
      if (text === "") {
        return [];
      }
      const { data, error } = await supabaseClient
        .rpc("search_profiles", {
          search_text: text,
        })
        .neq("janreco_id", null);
      if (error) {
        throw error;
      }
      return data.map((profile) => ({
        id: profile.id,
        name: profile.name,
        janrecoId: profile.janreco_id,
        isFriend: profile.is_friend,
      }));
    },

    getProfileExists: async ({ janrecoId }: { janrecoId: string }) => {
      const { data, error } = await supabaseClient
        .from("profiles")
        .select()
        .eq("janreco_id", janrecoId);
      if (error) {
        throw error;
      }
      return { data: data.length > 0 };
    },

    createProfile: async ({
      name,
    }: {
      name: string;
    }): Promise<AnonymousProfile> => {
      const { data, error } = await supabaseClient
        .from("profiles")
        .insert({ name })
        .select()
        .single();
      if (error) {
        throw error;
      }
      return {
        id: data.id,
        name: data.name ?? "",
      };
    },
  };
}
