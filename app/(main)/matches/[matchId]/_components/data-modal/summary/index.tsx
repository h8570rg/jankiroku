"use client";

import type { Match, MatchPlayer } from "@/lib/type";

export function Summary({ match }: { match: Match }) {
  const columns = [
    { name: "名前", uid: "name" },
    { name: "着順", uid: "rankCount" },
    { name: "平均着順", uid: "averageRank" },
    {
      name: "合計",
      uid: "totalScore",
    },
  ];

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.uid}>{column.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {match.players.map((item) => (
          <tr key={item.id}>
            {columns.map((column) => (
              <td key={column.uid}>{item[column.uid as keyof MatchPlayer]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
