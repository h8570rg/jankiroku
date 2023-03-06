import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

import { Database } from "~/lib/database.types";

export const createClient = (req: NextApiRequest, res: NextApiResponse) =>
  createServerSupabaseClient<Database>({
    req,
    res,
  });
