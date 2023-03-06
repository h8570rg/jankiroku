"use client";

import { useEffect } from "react";

import { useSupabase } from "~/components/SupabaseProvider";

export default function EmailConfirm() {
  const { supabase } = useSupabase();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // eslint-disable-next-line no-console
      console.debug({ event, session });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return "aaa";
}
