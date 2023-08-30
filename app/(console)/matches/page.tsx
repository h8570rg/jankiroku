import { services } from "~/lib/services";

import { MatchCreateButton } from "./MatchCreateButton";
import { MatchList } from "./MatchList";

async function getMatches() {
  return await services.matches.get();
}

export default async function Matches() {
  const matchesData = getMatches();
  const [matches] = await Promise.all([matchesData]);
  return (
    <div>
      matches
      <MatchList initialMatches={matches} />
      <MatchCreateButton />
    </div>
  );
}
