import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { User, UserProfile } from "@/lib/type";

/**
 * 1 回の描画の中では Supabase Auth への問い合わせを 1 回にまとめる。
 */
export const getUser = cache(async (): Promise<User> => {
  const supabase = await createClient();
  const userResponse = await supabase.auth.getUser();
  if (userResponse.error) throw userResponse.error;
  return userResponse.data.user;
});

/**
 * 未登録の可能性がある経路 (layout・/register・OAuth callback) 用。
 * 行がない、または name/display_id が未設定なら null を返す。
 */
export const getNullableUserProfile = cache(async (): Promise<UserProfile | null> => {
  const supabase = await createClient();
  const user = await getUser();

  const profileResponse = await supabase.from("profiles").select().eq("id", user.id).maybeSingle();
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
});

/**
 * (main) 配下の画面用。未登録のユーザーは `/register` へリダイレクトするので、
 * 呼び出し側には必ず `UserProfile` が返る。
 */
export async function getUserProfile(): Promise<UserProfile> {
  const userProfile = await getNullableUserProfile();
  if (!userProfile) {
    redirect("/register");
  }
  return userProfile;
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
  { success: true; data: UserProfile } | { success: false; error: { code: "DISPLAY_ID_TAKEN" } }
> {
  const supabase = await createClient();
  const user = await getUser();

  const updatedResponse = await supabase
    .from("profiles")
    .update({
      name,
      display_id: displayId,
      avatar_url: avatarUrl,
    })
    .eq("id", user.id)
    .select()
    .single();
  if (updatedResponse.error) {
    if (updatedResponse.error.code === "23505") {
      return { success: false, error: { code: "DISPLAY_ID_TAKEN" } };
    }
    throw updatedResponse.error;
  }
  const row = updatedResponse.data;
  if (row.name === null || row.display_id === null) {
    throw new Error("Updated user profile is missing name or display_id");
  }

  return {
    success: true,
    data: {
      id: row.id,
      name: row.name,
      displayId: row.display_id,
      avatarUrl: row.avatar_url,
      userId: user.id,
    },
  };
}
