import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "~/lib/database.types";
import { createSupabaseBrowserClient } from "~/lib/utils/supabase/browserClient";
import { createSupabaseServerClient } from "~/lib/utils/supabase/serverClient";
import { friendsService } from "./friends";
import { gameService } from "./game";
import { matchService } from "./match";
import { matchesService } from "./matches";
import { profileService } from "./profile";

const services = (supabaseClient: SupabaseClient<Database>) => {
  return {
    ...matchesService(supabaseClient),
    ...matchService(supabaseClient),
    ...profileService(supabaseClient),
    ...friendsService(supabaseClient),
    ...gameService(supabaseClient),
  };
};

export const serverServices = () => {
  const supabase = createSupabaseServerClient();
  return services(supabase);
};

export const browserServices = () => {
  const supabase = createSupabaseBrowserClient();
  return services(supabase);
};
