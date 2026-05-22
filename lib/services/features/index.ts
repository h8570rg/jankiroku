import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { friendService } from "./friend";
import { gameService } from "./game";
import { matchService } from "./match";
import { playerService } from "./player";
import { userService } from "./user";

export type Supabase = SupabaseClient<Database>;

export const services = (supabase: Supabase) => {
  return {
    ...matchService(supabase),
    ...userService(supabase),
    ...playerService(supabase),
    ...friendService(supabase),
    ...gameService(supabase),
  };
};
