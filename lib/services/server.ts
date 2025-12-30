import { services } from "@/lib/services/features";
import { createClient } from "@/lib/supabase/server";

export const serverServices = async () => {
	const supabase = await createClient();
	return services(supabase);
};
