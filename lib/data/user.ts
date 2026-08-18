import "server-only";
import type { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { User, UserProfile } from "@/lib/type";

export async function getUser(): Promise<User> {
  const supabase = await createClient();
  const userResponse = await supabase.auth.getUser();
  if (userResponse.error) throw userResponse.error;
  return userResponse.data.user;
}

/**
 * (main) 配下の画面用。layout で未登録ユーザーは `/register` へ
 * リダイレクトされる前提で、必ず `UserProfile` が返る。
 */
export async function getUserProfile(): Promise<UserProfile> {
  const supabase = await createClient();
  const userResponse = await supabase.auth.getUser();
  if (userResponse.error) throw userResponse.error;
  const user = userResponse.data.user;

  const profileResponse = await supabase.from("profiles").select().eq("user_id", user.id).single();
  if (profileResponse.error) throw profileResponse.error;
  const row = profileResponse.data;
  return {
    id: row.id,
    // TODO: fallbackをどうするか考える
    name: row.name ?? "",
    // TODO: fallbackをどうするか考える
    displayId: row.display_id ?? "",
    avatarUrl: row.avatar_url,
    userId: user.id,
  };
}

/**
 * 未登録の可能性がある経路 (layout・/register・OAuth callback) 用。
 * 行がない、または name/display_id が未設定なら null を返す。
 */
export async function getNullableUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
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
}

export async function updateUserProfile({
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
> {
  const supabase = await createClient();
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
  if (updatedResponse.error) return { success: false, error: updatedResponse.error };
  const row = updatedResponse.data;

  return {
    success: true,
    data: {
      id: row.id,
      // TODO: fallbackをどうするか考える
      name: row.name ?? "",
      // TODO: fallbackをどうするか考える
      displayId: row.display_id ?? "",
      avatarUrl: row.avatar_url,
      userId: user.id,
    },
  };
}
