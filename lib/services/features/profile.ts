import { PostgrestError } from "@supabase/supabase-js";
import { Profile, User } from "@/lib/type";
import { Supabase } from ".";

export const profileService = (supabase: Supabase) => {
  return {
    getUser: async (): Promise<User> => {
      const userResponse = await supabase.auth.getUser();
      if (userResponse.error) throw userResponse.error;
      const user = userResponse.data.user;
      return user;
    },

    getUserProfile: async (): Promise<Profile> => {
      const userResponse = await supabase.auth.getUser();
      if (userResponse.error) throw userResponse.error;
      const user = userResponse.data.user;

      const userProfileResponse = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id);
      if (userProfileResponse.error) throw userProfileResponse.error;
      const userProfile = userProfileResponse.data[0];

      if (!userProfile) {
        return {
          id: user.id,
          name: null,
          displayId: null,
          isUnregistered: true,
          isAnonymous: !!user.is_anonymous,
        };
      }

      return {
        id: userProfile.id,
        name: userProfile.name,
        displayId: userProfile.display_id,
        isUnregistered:
          userProfile.name === null || userProfile.display_id === null,
        isAnonymous: !!user.is_anonymous,
      };
    },

    updateUserProfile: async ({
      name,
      displayId,
    }: {
      name: string;
      displayId: string;
    }): Promise<
      | {
          success: true;
          data: Profile;
        }
      | {
          success: false;
          error: PostgrestError; // TODO: エラーハンドリングの体系化
        }
    > => {
      const userResponse = await supabase.auth.getUser();
      if (userResponse.error) throw userResponse.error;
      const user = userResponse.data.user;

      const updatedUserProfileResponse = await supabase
        .from("profiles")
        .update({ name, display_id: displayId })
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
          displayId: updatedUserProfile.display_id,
          isUnregistered:
            updatedUserProfile.name === null ||
            updatedUserProfile.display_id === null,
          isAnonymous: !!user.is_anonymous,
        },
      };
    },

    searchProfiles: async ({ text }: { text: string }): Promise<Profile[]> => {
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
          .or(`name.ilike.%${text}%,display_id.ilike.%${text}%`)
          .neq("display_id", null)
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
        displayId: profile.display_id!,
        isFriend: friends.some((friend) => friend.friend_id === profile.id),
      }));
    },

    createProfile: async ({ name }: { name: string }): Promise<Profile> => {
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
        displayId: profile.display_id,
      };
    },
  };
};
