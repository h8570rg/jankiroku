"use client";

import classNames from "classnames";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableFooter,
  TableFooterCell,
  TableFooterRow,
  TableHeader,
  TableRow,
} from "~/components/Table";
import { Game } from "~/lib/services/game";
import { Match } from "~/lib/services/match";
import { AddGameButton } from "./AddGameButton";
import { AddPlayerButton } from "./AddPlayerButton";

type Column = {
  id: string;
  janrecoId: string;
  name: string;
  type: "index" | "player" | "empty";
};

type Row = {
  [playerId: Column["id"]]: number;
};

export function MatchTable({ match, games }: { match: Match; games: Game[] }) {
  const { rule, players } = match;
  const { playersCount } = rule;

  const playersShortCount = playersCount - players.length;
  const isPlayersShort = playersShortCount > 0;

  const columns: Column[] = [
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

  const gameRows: Row[] =
    games?.map((game) =>
      Object.fromEntries(
        game.scores.map((score) => [score.profileId, score.score]),
      ),
    ) ?? [];

  const totalPointsRow: Row = Object.fromEntries(
    players.map((player) => [
      player.id,
      gameRows.reduce((acc, gameRow) => acc + gameRow[player.id], 0),
    ]),
  );

  const test = true;
  if (test) {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableColumn className="w-4">
              <span />
            </TableColumn>
            {columns.map((column) => (
              <TableColumn
                key={column?.id}
                className={classNames({
                  "px-1": column.type === "player" || column.type === "empty",
                  "w-4": column.type === "index",
                })}
              >
                <div
                  className={classNames("relative", {
                    "min-w-[60px]":
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
            ))}
          </TableHeader>
          <TableBody>
            {gameRows.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-center text-default-500">
                  {index + 1}
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    className={classNames("text-center", {
                      "text-danger": item[column.id] < 0,
                      "text-default-500": column.type === "index",
                    })}
                  >
                    {item[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <tr>
              <td colSpan={columns.length + 1}>
                <AddGameButton isDisabled={isPlayersShort} />
              </td>
            </tr>
          </TableBody>
          <TableFooter>
            <TableFooterRow>
              <TableFooterCell className="text-center">合計</TableFooterCell>
              {columns.map((column) => (
                <TableFooterCell className="text-center" key={column.id}>
                  {totalPointsRow[column.id]}
                </TableFooterCell>
              ))}
            </TableFooterRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
}
