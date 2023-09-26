import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "~/lib/database.types";
import { dayjs } from "~/lib/utils/date";

export type Match = {
  id: string;
  date: string;
};

export function matchService(supabaseClient: SupabaseClient<Database>) {
  return {
    getMatch: async ({ matchId }: { matchId: string }): Promise<Match> => {
      const { data, error } = await supabaseClient
        .from("matches")
        .select(
          `
          *,
          profiles!matches_profiles( * )
        `,
        )
        .eq("id", matchId)
        .single();
      if (error) {
        throw error;
      }
      return {
        id: data.id,
        date: dayjs(data.created_at).format("YYYY / M / D"),
      };
    },
  };
}
