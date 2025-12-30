import { services } from "@/lib/services/features";
import { createClient } from "@/lib/supabase/client";

export const browserServices = () => {
	const supabase = createClient();
	return services(supabase);
};
