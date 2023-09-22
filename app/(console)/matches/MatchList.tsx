"use client";

import classNames from "classnames";

import { Card, CardHeader } from "~/components/Card";
import { useMatches } from "~/lib/hooks/api/match";
import { Matches } from "~/lib/services/matches";

export function MatchList({
  initialMatches,
  className,
}: {
  initialMatches: Matches;
  className?: string;
}) {
  const { data: matches } = useMatches(initialMatches);

  return (
    <ul className={classNames(className, "space-y-4")}>
      {matches?.map((match) => (
        <li key={match.id}>
          <Card>
            <CardHeader>{match.date}</CardHeader>
          </Card>
        </li>
      ))}
    </ul>
  );
}
