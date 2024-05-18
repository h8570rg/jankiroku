import { services } from "@/lib/services/features";
import { createClient } from "@/lib/utils/supabase/server";

export const serverServices = () => {
  const supabase = createClient();
  return services(supabase);
};
