import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "~/lib/database.types";
import { friendsService } from "./friends";
import { gameService } from "./game";
import { matchService } from "./match";
import { matchesService } from "./matches";
import { profileService } from "./profile";

export type Supabase = SupabaseClient<Database>;

export const services = (supabase: Supabase) => {
  return {
    ...matchesService(supabase),
    ...matchService(supabase),
    ...profileService(supabase),
    ...friendsService(supabase),
    ...gameService(supabase),
  };
};
