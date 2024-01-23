import { services } from "~/lib/services";
import { createSupabaseBrowserClient } from "~/lib/utils/supabase/browserClient";

export const browserServices = () => {
  const supabase = createSupabaseBrowserClient();
  return services(supabase);
};
