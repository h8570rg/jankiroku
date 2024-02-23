"use client";

import classNames from "classnames";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "~/components/Table";
import { Game } from "~/lib/services/game";
import { Match } from "~/lib/services/match";
import { AddGameButton } from "./AddGameButton";
import { AddPlayerButton } from "./AddPlayerButton";

export function MatchTable({ match, games }: { match: Match; games: Game[] }) {
  const { rule, players } = match;
  const { playersCount } = rule;

  const playersShortCount = playersCount - players.length;
  const isPlayersShort = playersShortCount > 0;

  const playerColumns: {
    id: string;
    janrecoId: string;
    name: string;
    type: "index" | "player" | "empty";
  }[] = [
    { id: "index", janrecoId: "", name: "", type: "index" },
    ...players.map(
      (player) =>
        ({
          ...player,
          type: "player",
        }) as const,
    ),
    ...Array.from({ length: playersShortCount }).map(
      (_, i) =>
        ({
          id: `player-${i}`,
          janrecoId: "",
          name: "",
          type: "empty",
        }) as const,
    ),
  ];

  const gameRows: {
    [playerId: (typeof players)[number]["id"]]: number;
  }[] =
    games?.map((game, index) =>
      Object.fromEntries([
        ["key", `game-${index}`],
        ["index", index + 1],
        ...game.scores.map((score) => [score.profileId, score.score]),
      ]),
    ) ?? [];

  return (
    <div className="overflow-x-auto">
      <Table
        classNames={{
          table: "sticky top-0",
        }}
        removeWrapper
        aria-label="成績表"
        bottomContent={<AddGameButton isDisabled={isPlayersShort} />}
        isHeaderSticky
      >
        <TableHeader columns={playerColumns}>
          {(column) => (
            <TableColumn
              key={column?.id}
              className={classNames({
                "px-1": column.type === "player" || column.type === "empty",
                "w-4": column.type === "index",
              })}
            >
              <div
                className={classNames("relative", {
                  "min-w-[70px]":
                    column.type === "player" || column.type === "empty",
                })}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {column.type === "empty" && <AddPlayerButton />}
                  {column.type === "player" && (
                    <span className="truncate">{column.name}</span>
                  )}
                </div>
              </div>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={
            isPlayersShort
              ? "参加者を追加してください"
              : "まだデータはありません"
          }
          items={gameRows}
        >
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => {
                const value = getKeyValue(item, columnKey);
                return (
                  <TableCell
                    key={columnKey}
                    className={classNames("text-center", {
                      "text-danger": Number(value) < 0,
                      "text-default-500": columnKey === "index",
                    })}
                  >
                    {value}
                  </TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
