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

export type UpdateProfilePayload = {
  id: string;
  name: string;
  janrecoId: string;
};

export type AnonymousProfile = {
  id: string;
  name: string;
};

export type ProfileExists = {
  exists: boolean;
};

export function profileService(supabaseClient: SupabaseClient<Database>) {
  return {
    getUserProfile: async (): Promise<Profile | UnregisteredProfile> => {
      const getUserResult = await supabaseClient.auth.getUser();
      if (getUserResult.error) {
        throw getUserResult.error;
      }
      const user = getUserResult.data.user;
      const { data, error } = await supabaseClient
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single();
      if (error) {
        throw error;
      }
      return {
        id: data.id,
        name: data.name,
        janrecoId: data.janreco_id,
      };
    },

    updateProfile: async ({
      id,
      name,
      janrecoId,
    }: UpdateProfilePayload): Promise<Profile> => {
      const { data, error } = await supabaseClient
        .from("profiles")
        .update({ name, janreco_id: janrecoId })
        .eq("id", id)
        .select()
        .single();
      if (error) {
        throw error;
      }
      if (!data.name || !data.janreco_id) {
        throw new Error("profile validation failed.");
      }
      return {
        id: data.id,
        name: data.name,
        janrecoId: data.janreco_id,
        isFriend: false,
      };
    },

    /**
     * @see https://github.com/supabase/postgrest-js/issues/289
     */
    searchProfiles: async ({ text }: { text: string }): Promise<Profile[]> => {
      if (text === "") {
        return [];
      }
      const { data, error } = await supabaseClient.rpc("search_profiles", {
        search_text: text,
      });
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

    getProfileExists: async ({
      janrecoId,
    }: {
      janrecoId: string;
    }): Promise<ProfileExists> => {
      const { data, error } = await supabaseClient
        .from("profiles")
        .select()
        .eq("janreco_id", janrecoId);
      if (error) {
        throw error;
      }
      return { exists: data.length > 0 };
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
