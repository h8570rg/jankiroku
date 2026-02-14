import { serverServices } from "@/lib/services/server";
import { CreateMatchButton } from "./_components/create-match-button";
import { MatchCard } from "./_components/match-card";

export default async function Matches() {
  const { getMatches, getUser } = await serverServices();

  // TODO: infinite scroll
  const [matches, user] = await Promise.all([getMatches({}), getUser()]);
  return (
    <div>
      <h1 className="heading-1 mb-1">成績表</h1>
      {matches.length === 0 && (
        <p className="my-10 text-center text-sm text-muted">
          まだ成績表がありません。
        </p>
      )}
      <ul className="space-y-4">
        {matches?.map((match) => (
          <li key={match.id}>
            <MatchCard match={match} userId={user.id} />
          </li>
        ))}
      </ul>
      <div
        className="
          sticky inset-x-0 bottom-0 z-10 bg-linear-to-t from-background p-4
        "
      >
        <CreateMatchButton className="w-full" />
      </div>
    </div>
  );
}
