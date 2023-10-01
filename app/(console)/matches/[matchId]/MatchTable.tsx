"use client";

import { CSSProperties } from "react";
import { Divider } from "~/components/Divider";
import { useMatch } from "~/lib/hooks/api/match";
import { Match } from "~/lib/services/match";
import MatchAddButton from "./MatchAddButton";
import { MatchPlayerAddButton } from "./MatchPlayerAddButton";

export default function MatchTable({ defaultValue }: { defaultValue: Match }) {
  const { data: match } = useMatch(defaultValue.id, defaultValue);

  const { rule } = match;

  const { playersCount } = rule;

  const players: ((typeof match.players)[number] | null)[] =
    match.players.concat(Array(playersCount - match.players.length).fill(null));

  const tableRowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `20px repeat(${playersCount},minmax(60px,1fr))`,
  };

  return (
    <div className="overflow-x-auto">
      <div className="" style={tableRowStyle}>
        {/* for row index column */}
        <div></div>
        {players.map((player, index) =>
          player ? (
            <div
              className="flex items-center justify-center text-sm"
              key={player.id}
            >
              {player.name}
            </div>
          ) : (
            <div
              className="flex items-center justify-center p-2"
              key={`player-${index}`}
            >
              <MatchPlayerAddButton />
            </div>
          ),
        )}
      </div>
      <Divider />
      {/* <ol className="relative">
        {Array.from({ length: 3 }).map((_, index) => (
          <Fragment key={`row-${index}`}>
            <li className="h-8" style={tableRowStyle}>
              <div className="flex items-center justify-center">
                {index + 1}
              </div>
              {players.map((player, index) => (
                <div
                  className="flex h-full items-center justify-center"
                  key={`row-${index}-${player?.id ?? uniqueId("player")}`}
                >
                </div>
              ))}
            </li>
            <Divider />
          </Fragment>
        ))}
      </ol> */}
      <div className="py-2">
        <MatchAddButton />
      </div>
    </div>
  );
}
