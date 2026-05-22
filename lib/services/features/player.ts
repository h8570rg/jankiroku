import type { Player } from "@/lib/type";
import type { Supabase } from ".";
import { getCurrentProfileId } from "./internal";

export const playerService = (supabase: Supabase) => {
  return {
    /**
     * 登録済みプレイヤーのみを検索する。ゲストは含まれない。
     * 「フレンド済みか」の判定が必要な場合は呼び出し側で `getFriends()`
     * と組み合わせる。
     */
    searchPlayers: async ({ text }: { text: string }): Promise<Player[]> => {
      if (text === "") {
        return [];
      }

      const currentProfileId = await getCurrentProfileId(supabase);

      /**
       * @see https://supabase.com/docs/guides/database/full-text-search?queryGroups=language&language=js#search-multiple-columns
       */
      const profilesResponse = await supabase
        .from("profiles")
        .select("*")
        .or(`name.ilike.%${text}%,display_id.ilike.%${text}%`)
        .not("display_id", "is", null)
        .not("name", "is", null)
        .not("user_id", "is", null)
        .neq("id", currentProfileId);

      if (profilesResponse.error) throw profilesResponse.error;
      return profilesResponse.data.map((row) => ({
        id: row.id,
        // biome-ignore lint/style/noNonNullAssertion: name IS NULL を query で除外
        name: row.name!,
        displayId: row.display_id,
        avatarUrl: row.avatar_url,
      }));
    },

    /**
     * ゲストプレイヤーを新規作成する。auth.users には紐づかない。
     */
    createGuestPlayer: async ({ name }: { name: string }): Promise<Player> => {
      const response = await supabase
        .from("profiles")
        .insert({ name })
        .select()
        .single();
      if (response.error) throw response.error;
      return {
        id: response.data.id,
        name,
        displayId: response.data.display_id,
        avatarUrl: response.data.avatar_url,
      };
    },
  };
};
