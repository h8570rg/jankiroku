import { Suspense } from "react";
import { getFriends } from "@/lib/data/friend";
import { getMatch } from "@/lib/data/match";
import { MatchHeader } from "./_components/match-header";
import { MatchTable } from "./_components/match-table";

export default async function Match({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  const [friends, match] = await Promise.all([getFriends(), getMatch({ matchId })]);

  return (
    <div className="flex h-full flex-col">
      <MatchHeader match={match} friends={friends} matchId={matchId} />
      <Suspense fallback={null}>
        <MatchTable className="grow" matchId={matchId} />
      </Suspense>
    </div>
  );
}
