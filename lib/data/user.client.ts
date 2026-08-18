import { createClient } from "@/lib/supabase/client";

export async function uploadAvatar(file: File): Promise<string> {
  const supabase = createClient();
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
}
