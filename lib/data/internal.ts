import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export type Supabase = SupabaseClient<Database>;

/**
 * ログインしている自分の profiles.id を返す。
 * 認証ユーザーが存在しない、または profile 行が存在しない場合は例外を投げる。
 */
export const getUserProfileId = async (supabase: Supabase): Promise<string> => {
  const userResponse = await supabase.auth.getUser();
  if (userResponse.error) throw userResponse.error;
  const user = userResponse.data.user;

  const profileResponse = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (profileResponse.error) throw profileResponse.error;
  return profileResponse.data.id;
};
