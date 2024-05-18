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
import { serverServices } from "~/lib/services/server";
import { AddChipButton } from "./AddChipButton";
import { AddGameButton } from "./AddGameButton";
import { AddPlayerButton } from "./AddPlayerButton";

type Column = {
  id: string;
  janrecoId: string | null;
  name: string | null;
  type: "index" | "player" | "empty";
};

type Row = {
  [playerId: Column["id"]]: number;
};

export async function MatchTable({ matchId }: { matchId: string }) {
  const { getMatch } = serverServices();
  const [match] = await Promise.all([getMatch({ matchId })]);
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
    match.games?.map((game) =>
      Object.fromEntries(
        game.players.map((player) => [player.id, player.score]),
      ),
    ) ?? [];

  const totalPointsRow: Row = Object.fromEntries(
    players.map((player) => [
      player.id,
      gameRows.reduce((acc, gameRow) => acc + gameRow[player.id], 0),
    ]),
  );

  const chipsRow: Row = Object.fromEntries(
    players.map((player) => [player.id, player.result.chipCount ?? 0]),
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableColumn className="">
            <span />
          </TableColumn>
          {columns.map((column) => (
            <TableColumn key={column?.id} className="px-1">
              <div className="relative min-w-[60px] ">
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
                  })}
                >
                  {item[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <tr aria-hidden="true" className="mx-1 block size-px"></tr>
          <tr>
            <td colSpan={columns.length + 1}>
              <div className="flex flex-col gap-1">
                <AddGameButton isDisabled={isPlayersShort} />
                <AddChipButton isDisabled={isPlayersShort} />
              </div>
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
          <TableFooterRow>
            <TableFooterCell className="text-center">チップ</TableFooterCell>
            {columns.map((column) => (
              <TableFooterCell className="text-center" key={column.id}>
                {chipsRow[column.id]}
              </TableFooterCell>
            ))}
          </TableFooterRow>
          <TableFooterRow>
            <TableFooterCell className="text-center">収支</TableFooterCell>
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
