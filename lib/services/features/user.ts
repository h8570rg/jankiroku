import type { PostgrestError } from "@supabase/supabase-js";
import type { User, UserProfile } from "@/lib/type";
import type { Supabase } from ".";

export const userService = (supabase: Supabase) => {
  return {
    getUser: async (): Promise<User> => {
      const userResponse = await supabase.auth.getUser();
      if (userResponse.error) throw userResponse.error;
      return userResponse.data.user;
    },

    /**
     * (main) 配下の画面用。layout で未登録ユーザーは `/register` へ
     * リダイレクトされる前提で、必ず `UserProfile` が返る。
     */
    getUserProfile: async (): Promise<UserProfile> => {
      const userResponse = await supabase.auth.getUser();
      if (userResponse.error) throw userResponse.error;
      const user = userResponse.data.user;

      const profileResponse = await supabase
        .from("profiles")
        .select()
        .eq("user_id", user.id)
        .single();
      if (profileResponse.error) throw profileResponse.error;
      const row = profileResponse.data;
      return {
        id: row.id,
        // biome-ignore lint/style/noNonNullAssertion: 未登録ユーザーは layout で redirect 済み
        name: row.name!,
        // biome-ignore lint/style/noNonNullAssertion: 未登録ユーザーは layout で redirect 済み
        displayId: row.display_id!,
        avatarUrl: row.avatar_url,
        userId: user.id,
      };
    },

    /**
     * 未登録の可能性がある経路 (layout・/register・OAuth callback) 用。
     * 行がない、または name/display_id が未設定なら null を返す。
     */
    getNullableUserProfile: async (): Promise<UserProfile | null> => {
      const userResponse = await supabase.auth.getUser();
      if (userResponse.error) throw userResponse.error;
      const user = userResponse.data.user;

      const profileResponse = await supabase
        .from("profiles")
        .select()
        .eq("user_id", user.id)
        .maybeSingle();
      if (profileResponse.error) throw profileResponse.error;
      const row = profileResponse.data;
      if (!row || row.name === null || row.display_id === null) {
        return null;
      }
      return {
        id: row.id,
        name: row.name,
        displayId: row.display_id,
        avatarUrl: row.avatar_url,
        userId: user.id,
      };
    },

    updateUserProfile: async ({
      name,
      displayId,
      avatarUrl,
    }: {
      name: string;
      displayId: string;
      avatarUrl?: string;
    }): Promise<
      | {
          success: true;
          data: UserProfile;
        }
      | {
          success: false;
          error: PostgrestError; // TODO: エラーハンドリングの体系化
        }
    > => {
      const userResponse = await supabase.auth.getUser();
      if (userResponse.error) throw userResponse.error;
      const user = userResponse.data.user;

      const updatedResponse = await supabase
        .from("profiles")
        .update({
          name,
          display_id: displayId,
          avatar_url: avatarUrl,
        })
        .eq("user_id", user.id)
        .select()
        .single();
      if (updatedResponse.error)
        return { success: false, error: updatedResponse.error };
      const row = updatedResponse.data;

      return {
        success: true,
        data: {
          id: row.id,
          // biome-ignore lint/style/noNonNullAssertion: UPDATE で name を設定済み
          name: row.name!,
          // biome-ignore lint/style/noNonNullAssertion: UPDATE で display_id を設定済み
          displayId: row.display_id!,
          avatarUrl: row.avatar_url,
          userId: user.id,
        },
      };
    },

    uploadAvatar: async (file: File): Promise<string> => {
      const userResponse = await supabase.auth.getUser();
      if (userResponse.error) throw userResponse.error;
      const user = userResponse.data.user;

      const path = `${user.id}/avatar`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      return `${data.publicUrl}?t=${Date.now()}`;
    },
  };
};
