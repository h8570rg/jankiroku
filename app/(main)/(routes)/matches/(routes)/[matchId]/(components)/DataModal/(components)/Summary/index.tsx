"use client";

import classNames from "classnames";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Match } from "@/lib/type";

export function Summary({ match }: { match: Match }) {
  const columns = [
    { name: "名前", uid: "name" },
    { name: "着順", uid: "rankCount" },
    {
      name: "合計",
      uid: "totalScore",
    },
  ];

  return (
    <Table
      classNames={{
        wrapper: classNames("p-0"),
        th: classNames("bg-inherit"),
      }}
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody items={match.players}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell className="break-all">
                {(() => {
                  switch (columnKey) {
                    case "name":
                      return item.name;
                    case "rankCount":
                      return item.rankCounts.join("-");
                    case "totalScore":
                      return item.totalScore;
                  }
                })()}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
