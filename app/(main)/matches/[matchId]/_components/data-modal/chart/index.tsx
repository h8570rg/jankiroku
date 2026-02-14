"use client";

import { cn } from "@heroui/react";
import {
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { Match } from "@/lib/type";

const colors = ["#F871A0", "#66AAF9", "#74DFA2", "#AE7EDE", "#F9C97C"]; // TODO: light dark 切替

export function DataChart({
  match,
  className,
}: {
  match: Match;
  className?: string;
}) {
  const data = match.games.reduce(
    (acc, game, index) => {
      acc.push({
        name: index + 1,
        ...match.players.reduce(
          (prevPlayers, player) => {
            const prevGamePlayer = acc.find((data) => data.name === index);
            const gamePlayer = game.players.find((p) => p.id === player.id);

            const totalScore = prevGamePlayer
              ? gamePlayer
                ? prevGamePlayer[player.id] + gamePlayer.score
                : prevGamePlayer[player.id]
              : gamePlayer
                ? gamePlayer.score
                : 0;
            prevPlayers[player.id] = totalScore;
            return prevPlayers;
          },
          {} as Record<string, number>,
        ),
      });
      return acc;
    },
    [] as { name: number; [key: string]: number }[],
  );

  return (
    <div
      className={cn(
        "h-[300px] w-full rounded-lg bg-surface p-2 shadow-sm",
        className,
      )}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            type="number"
            dataKey="name"
            domain={[1, "dataMax"]}
            padding={{ left: 20, right: 20 }}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis type="number" tickLine={false} tick={{ fontSize: 12 }} />
          <ReferenceLine y={0} strokeDasharray="4 4" />
          <Legend
            formatter={(v) => (
              <span className="text-sm">
                {match.players.find((player) => player.id === v)?.name}
              </span>
            )}
            fontSize={11}
          />
          {match.players.map((player) => (
            <Line
              key={player.id}
              type="linear"
              dataKey={player.id}
              stroke={colors[match.players.indexOf(player)] ?? "#D4D4D8"}
              strokeWidth={2}
              dot={{ strokeWidth: 4, r: 1 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
