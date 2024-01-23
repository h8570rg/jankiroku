import { services } from "~/lib/services";
import { createSupabaseServerClient } from "~/lib/utils/supabase/serverClient";

export const serverServices = () => {
  const supabase = createSupabaseServerClient();
  return services(supabase);
};
