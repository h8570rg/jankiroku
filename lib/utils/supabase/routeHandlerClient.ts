import "server-only";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "~/lib/database.types";

export const createSupabaseClient = () =>
  createRouteHandlerClient<Database>({ cookies });
