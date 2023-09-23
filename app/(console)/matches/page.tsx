import { services } from "~/lib/services";
import { createSupabaseClient } from "~/lib/utils/supabase/serverComponentClient";

import { MatchCreateButton } from "./MatchCreateButton";
import { MatchList } from "./MatchList";

export default async function Matches() {
  const supabaseClient = createSupabaseClient();
  const { getMatches } = services(supabaseClient);
  const matchesData = await getMatches();
  const [matches] = await Promise.all([matchesData]);
  return (
    <div>
      <h1 className="heading-1 mb-1">ゲーム</h1>
      <MatchList initialMatches={matches} />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <MatchCreateButton className="w-full" />
      </div>
    </div>
  );
}
