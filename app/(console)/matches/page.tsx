import { services } from "~/lib/services";
import { createSupabaseServerComponentClient } from "~/lib/utils/supabase/serverComponentClient";
import { MatchCreateButton } from "./MatchCreateButton";
import { MatchList } from "./MatchList";

export const dynamic = "force-dynamic";

export default async function Matches() {
  const supabaseClient = createSupabaseServerComponentClient();
  const { getMatches } = services(supabaseClient);
  const matches = await getMatches();
  return (
    <div>
      <h1 className="heading-1 mb-1">成績表</h1>
      <MatchList initialMatches={matches} />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <MatchCreateButton className="w-full" />
      </div>
    </div>
  );
}
