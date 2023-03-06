"use client";

import { createClient } from "~/lib/utils/supabase-browser";

export const Debug = () => {
  const supabase = createClient();
  supabase.auth.getUser().then((data) => {
    // eslint-disable-next-line no-console
    console.debug({ data });
  });
  return <>debug</>;
};
