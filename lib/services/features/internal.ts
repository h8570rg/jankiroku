import type { Supabase } from ".";

/**
 * 認証中ユーザーに紐づく profiles.id を返す。
 * 認証ユーザーが存在しない、または profile 行が存在しない場合は例外を投げる。
 */
export const getCurrentProfileId = async (
  supabase: Supabase,
): Promise<string> => {
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
