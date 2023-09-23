import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "~/lib/database.types";

export type Profile = {
  id: string;
  name: string | null;
  janrecoId: string | null;
};

export type UpdateProfilePayload = {
  id: string;
  name: string;
  janrecoId: string;
};

export function profileService(supabaseClient: SupabaseClient<Database>) {
  return {
    getUserProfile: async (): Promise<Profile> => {
      const getUserResult = await supabaseClient.auth.getUser();
      if (getUserResult.error) {
        throw getUserResult.error;
      }
      const user = getUserResult.data.user;
      const getProfileResult = await supabaseClient
        .from("profiles")
        .select()
        .eq("id", user.id);
      if (getProfileResult.error) {
        throw getProfileResult.error;
      }
      const profile = getProfileResult.data[0];
      return {
        id: profile.id,
        name: profile.name,
        janrecoId: profile.janreco_id,
      };
    },

    getProfile: async ({ id }: { id: string }): Promise<Profile> => {
      const { data, error } = await supabaseClient
        .from("profiles")
        .select()
        .eq("id", id);
      if (error) {
        throw error;
      }
      const profile = data[0];
      return {
        id: profile.id,
        name: profile.name,
        janrecoId: profile.janreco_id,
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
        .select();
      if (error) {
        throw error;
      }
      const profile = data[0];
      return {
        id: profile.id,
        name: profile.name,
        janrecoId: profile.janreco_id,
      };
    },
  };
}
