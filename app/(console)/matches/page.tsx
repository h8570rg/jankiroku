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
      <h1 className="heading-1">ゲーム</h1>
      <MatchList initialMatches={matches} />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <MatchCreateButton className="w-full" />
      </div>
    </div>
  );
}
