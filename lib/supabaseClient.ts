import { createClient } from "@supabase/supabase-js";
import { config } from "~/lib/config";

export const supabase = createClient(
  config.public.supabase.apiURL,
  config.public.supabase.apiKey
);
