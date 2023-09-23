"use client";

import classNames from "classnames";
import Link from "next/link";

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
            <Link href={`/matches/${match.id}`}>
              <CardHeader>{match.date}</CardHeader>
            </Link>
          </Card>
        </li>
      ))}
    </ul>
  );
}
