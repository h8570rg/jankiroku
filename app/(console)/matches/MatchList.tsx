"use client";

import { useMatches } from "~/lib/hooks/api/match";
import { Matches } from "~/lib/models/match";

export const MatchList = ({ initialMatches }: { initialMatches: Matches }) => {
  const { data: matches } = useMatches(initialMatches);

  return (
    <>
      {matches?.map((match) => (
        <div key={match.id}>{match.id}</div>
      ))}
    </>
  );
};
