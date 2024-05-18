import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import { friendService } from "./friend";
import { matchService } from "./match";
import { profileService } from "./profile";

export type Supabase = SupabaseClient<Database>;

export const services = (supabase: Supabase) => {
  return {
    ...matchService(supabase),
    ...profileService(supabase),
    ...friendService(supabase),
  };
};
