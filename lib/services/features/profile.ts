import { Supabase } from ".";

export function profileService(supabase: Supabase) {
  return {
    getUserProfile: async () => {
      const getUserResult = await supabase.auth.getUser();
      if (getUserResult.error) {
        throw getUserResult.error;
      }
      if (!getUserResult.data.user) {
        throw new Error("User not found");
      }

      const { user } = getUserResult.data;

      const { data, error } = await supabase
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
      const { error } = await supabase
        .from("profiles")
        .update({ name, janreco_id: janrecoId })
        .eq("id", userId);
      if (error) {
        throw error;
      }
    },

    /**
     * @see https://github.com/supabase/postgrest-js/issues/
     * @see https://supabase.com/docs/guides/database/full-text-search?queryGroups=language&language=js#search-multiple-columns
     */
    searchProfiles: async ({ text }: { text: string }) => {
      if (text === "") {
        return [];
      }
      const user = await supabase.auth.getUser();
      if (user.error) throw user.error;
      const [profilesResult, friendsResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .textSearch("name_janreco_id", text)
          .neq("janreco_id", null)
          .neq("name", null)
          .neq("id", user.data.user.id),
        supabase
          .from("friends")
          .select("friend_id")
          .eq("profile_id", user.data.user.id),
      ]);
      if (profilesResult.error) {
        throw profilesResult.error;
      }
      if (friendsResult.error) {
        throw friendsResult.error;
      }

      return profilesResult.data.map((profile) => ({
        id: profile.id,
        name: profile.name!,
        janrecoId: profile.janreco_id!,
        isFriend: friendsResult.data.some(
          (friend) => friend.friend_id === profile.id,
        ),
      }));
    },

    getProfileExists: async ({ janrecoId }: { janrecoId: string }) => {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("janreco_id", janrecoId);
      if (error) {
        throw error;
      }
      return { data: data.length > 0 };
    },

    createProfile: async ({ name }: { name: string }) => {
      const { data, error } = await supabase
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
