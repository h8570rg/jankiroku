import "server-only";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

import { Database } from "~/lib/database.types";

export const createSupabaseClient = (cookies: () => ReadonlyRequestCookies) =>
  createServerComponentClient<Database>({
    cookies,
  });
