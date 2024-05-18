import { PostgrestError } from "@supabase/supabase-js";
import { Profile } from "@/lib/type";
import { Supabase } from ".";

export function profileService(supabase: Supabase) {
  return {
    async getUserProfile(): Promise<Profile> {
      const userResponse = await supabase.auth.getUser();
      if (userResponse.error) throw userResponse.error;
      const user = userResponse.data.user;

      const userProfileResponse = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single();
      if (userProfileResponse.error) throw userProfileResponse.error;
      const userProfile = userProfileResponse.data;

      return {
        id: userProfile.id,
        name: userProfile.name,
        janrecoId: userProfile.janreco_id,
        isUnregistered:
          userProfile.name === null || userProfile.janreco_id === null,
        isAnonymous: !!user.is_anonymous,
      };
    },

    async updateUserProfile({
      name,
      janrecoId,
    }: {
      name: string;
      janrecoId: string;
    }): Promise<
      | {
          success: true;
          data: Profile;
        }
      | {
          success: false;
          error: PostgrestError; // TODO: エラーハンドリングの体系化
        }
    > {
      const userResponse = await supabase.auth.getUser();
      if (userResponse.error) throw userResponse.error;
      const user = userResponse.data.user;

      const updatedUserProfileResponse = await supabase
        .from("profiles")
        .update({ name, janreco_id: janrecoId })
        .eq("id", user.id)
        .select()
        .single();
      if (updatedUserProfileResponse.error)
        return { success: false, error: updatedUserProfileResponse.error };
      const updatedUserProfile = updatedUserProfileResponse.data;

      return {
        success: true,
        data: {
          id: updatedUserProfile.id,
          name: updatedUserProfile.name,
          janrecoId: updatedUserProfile.janreco_id,
          isUnregistered:
            updatedUserProfile.name === null ||
            updatedUserProfile.janreco_id === null,
          isAnonymous: !!user.is_anonymous,
        },
      };
    },

    async searchProfiles({ text }: { text: string }): Promise<Profile[]> {
      if (text === "") {
        return [];
      }
      const userResponse = await supabase.auth.getUser();
      if (userResponse.error) throw userResponse.error;
      const user = userResponse.data.user;

      /**
       * @see https://supabase.com/docs/guides/database/full-text-search?queryGroups=language&language=js#search-multiple-columns
       */
      const [profilesResponse, friendsResponse] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .textSearch("name_janreco_id", text)
          .neq("janreco_id", null)
          .neq("name", null)
          .neq("id", user.id),
        supabase.from("friends").select("friend_id").eq("profile_id", user.id),
      ]);
      if (profilesResponse.error) throw profilesResponse.error;
      if (friendsResponse.error) throw friendsResponse.error;
      const profiles = profilesResponse.data;
      const friends = friendsResponse.data;

      return profiles.map((profile) => ({
        id: profile.id,
        name: profile.name!,
        janrecoId: profile.janreco_id!,
        isFriend: friends.some((friend) => friend.friend_id === profile.id),
      }));
    },

    async createProfile({ name }: { name: string }): Promise<Profile> {
      const profilesResponse = await supabase
        .from("profiles")
        .insert({ name })
        .select()
        .single();
      if (profilesResponse.error) throw profilesResponse.error;
      const profile = profilesResponse.data;

      return {
        id: profile.id,
        name: profile.name ?? name,
        janrecoId: profile.janreco_id,
      };
    },
  };
}
