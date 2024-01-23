import { serverServices } from "~/lib/services/server";
import { MatchCreateButton } from "./MatchCreateButton";
import { MatchList } from "./MatchList";

export const dynamic = "force-dynamic";

export default async function Matches() {
  const { getMatches } = serverServices();
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
