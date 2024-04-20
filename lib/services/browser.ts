import { services } from "~/lib/services";
import { createClient } from "~/lib/utils/supabase/client";

export const browserServices = () => {
  const supabase = createClient();
  return services(supabase);
};
