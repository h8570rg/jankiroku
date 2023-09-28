"use client";

import { CSSProperties } from "react";
import { Button } from "~/components/Button";
import { useMatch } from "~/lib/hooks/api/match";
import { Match } from "~/lib/services/match";

export default function MatchTable({ defaultValue }: { defaultValue: Match }) {
  const { data: match } = useMatch(defaultValue.id, defaultValue);

  const { rule } = match;

  const { playersCount } = rule;

  // match.playersがplayersCountより少ない場合はnullで埋めて配列を作る
  const players: ((typeof match.players)[number] | null)[] =
    match.players.concat(Array(playersCount - match.players.length).fill(null));

  const tableRowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${playersCount},minmax(60px,1fr))`,
  };
  return (
    <div className="overflow-x-auto">
      <div className="divide-x" style={tableRowStyle}>
        {players.map((player, index) =>
          player ? (
            <div className="flex items-center justify-center" key={player.id}>
              {player.name}
            </div>
          ) : (
            <div key={`player-${index}`}>
              <Button>追加</Button>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
