"use client";

import { cn, Surface } from "@heroui/react";
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
    <Surface className={cn("h-[300px] rounded-3xl p-2", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            type="number"
            dataKey="name"
            domain={[1, "dataMax"]}
            padding={{ left: 15, right: 15 }}
            tickLine={false}
            tick={{ fontSize: 10 }}
            allowDecimals={false}
          />
          <YAxis
            type="number"
            tickLine={false}
            tick={{ fontSize: 10 }}
            width={30}
          />
          <ReferenceLine y={0} strokeDasharray="4 4" />
          <Legend
            content={({ payload }) => (
              <ul className="flex justify-center gap-3">
                {payload?.map((entry) => (
                  <li key={entry.value} className="flex items-center gap-1">
                    <span
                      className="size-1.5 rounded-full"
                      style={{ background: entry.color }}
                    />
                    <span
                      className="text-[10px]"
                      style={{ color: entry.color }}
                    >
                      {match.players.find((p) => p.id === entry.value)?.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
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
    </Surface>
  );
}
