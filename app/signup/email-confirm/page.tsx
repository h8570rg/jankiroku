"use client";

import { useEffect } from "react";

import { useSupabase } from "~/components/SupabaseProvider";

export default function EmailConfirm() {
  const { supabase } = useSupabase();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then((session) => {
        // eslint-disable-next-line no-console
        console.debug({ session });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.debug({ err });
      });
  }, [supabase.auth]);
  return "aaa";
}
