"use client";

import classNames from "classnames";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { useDisclosure } from "~/components/Modal";
import { Table, TableBody, TableColumn, TableHeader } from "~/components/Table";
import { useMatch } from "~/lib/hooks/api/match";
import { Match } from "~/lib/services/match";
import { MatchPlayerInputModal } from "./MatchPlayerInputModal";

export default function MatchTable({ match: defaultMatch }: { match: Match }) {
  const { data: match } = useMatch(defaultMatch);

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
    { id: "", janrecoId: "", name: "", type: "index" },
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

  const matchPlayerInputModal = useDisclosure();

  return (
    <div className="overflow-x-auto">
      <Table removeWrapper aria-label="成績表">
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
                  {column.type === "empty" && (
                    <Button
                      className="w-full"
                      size="sm"
                      radius="md"
                      variant="solid"
                      color="primary"
                      isIconOnly
                      startContent={
                        <Icon className="h-4 w-4 fill-current" name="add" />
                      }
                      onClick={matchPlayerInputModal.onOpen}
                    >
                      追加
                    </Button>
                  )}
                  {column.type === "player" && (
                    <span className="truncate">{column.name}</span>
                  )}
                </div>
              </div>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={isPlayersShort ? "参加者を追加してください" : "あああ"}
        >
          {/* <TableRow key="a">
            <TableCell className="px-0.5">1</TableCell>
            <TableCell>aa</TableCell>
            <TableCell>aa</TableCell>
            <TableCell>aa</TableCell>
            <TableCell>aa</TableCell>
          </TableRow> */}
        </TableBody>
      </Table>
      <MatchPlayerInputModal
        match={match}
        isOpen={matchPlayerInputModal.isOpen}
        onOpenChange={matchPlayerInputModal.onOpenChange}
        onClose={matchPlayerInputModal.onClose}
      />
    </div>
  );
}
