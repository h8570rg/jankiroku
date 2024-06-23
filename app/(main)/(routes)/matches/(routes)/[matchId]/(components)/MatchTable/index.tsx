import classNames from "classnames";
import { serverServices } from "@/lib/services/server";
import { MatchPlayer } from "@/lib/type";
import { AddGameButton } from "./(components)/AddGameButton";
import styles from "./styles.module.css";

type Column = {
  id: string;
  janrecoId: string | null;
  name: string | null;
  type: "index" | "player" | "empty";
} & MatchPlayer;

type Row = {
  [playerId: Column["id"]]: number;
};

export async function MatchTable({
  matchId,
  className,
}: {
  matchId: string;
  className?: string;
}) {
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
          rankCounts: [0] as number[],
          averageRank: 0,
          totalScore: 0,
          chipCount: 0,
          result: 0,
        }) as const,
    ),
  ];

  const gameRows: Row[] =
    match.games?.map((game) =>
      Object.fromEntries(
        game.players.map((player) => [player.id, player.score]),
      ),
    ) ?? [];

  return (
    <div className={classNames(className, "flex flex-col")}>
      <div
        className={classNames(
          styles["row"],
          "flex items-center rounded-lg bg-default-100 text-foreground-500",
        )}
      >
        <div
          className={classNames(
            styles["col"],
            styles["col--header"],
            styles["col--index"],
          )}
        />
        {columns.map((column) => (
          <div
            key={column?.id}
            className={classNames(styles["col--header"], styles["col"])}
          >
            {column.type === "player" && (
              <span className="truncate">{column.name}</span>
            )}
          </div>
        ))}
      </div>
      <div className="grow">
        {gameRows.map((item, index) => (
          <div
            className={classNames(styles["row"], "flex items-center py-1")}
            key={index}
          >
            <div
              className={classNames(
                styles["col"],
                styles["col--index"],
                styles["col--body"],
              )}
            >
              {index + 1}
            </div>
            {columns.map((column) => (
              <div
                key={column.id}
                className={classNames(styles["col"], styles["col--body"], {
                  "text-danger": item[column.id] < 0,
                })}
              >
                {item[column.id]}
              </div>
            ))}
          </div>
        ))}
        <div>
          {/* TODO: disabledやめる */}
          <AddGameButton isDisabled={isPlayersShort} />
          {/* <AddChipButton isDisabled={isPlayersShort} /> */}
        </div>
      </div>
      <div className="rounded-lg bg-default-100 text-foreground-500">
        <div className={classNames(styles["row"])}>
          <div
            className={classNames(
              styles["col"],
              styles["col--index"],
              styles["col--footer"],
            )}
          >
            合計
          </div>
          {columns.map((column) => (
            <div
              className={classNames(styles["col"], styles["col--footer"], {
                "text-danger": column.totalScore < 0,
              })}
              key={column.id}
            >
              {column.totalScore}
            </div>
          ))}
        </div>
        <div className={classNames(styles["row"])}>
          <div
            className={classNames(
              styles["col"],
              styles["col--index"],
              styles["col--footer"],
            )}
          >
            チップ
          </div>
          {columns.map((column) => (
            <div
              className={classNames(styles["col"], styles["col--footer"])}
              key={column.id}
            >
              {column.chipCount}
            </div>
          ))}
        </div>
        <div className={classNames(styles["row"])}>
          <div
            className={classNames(
              styles["col"],
              styles["col--index"],
              styles["col--footer"],
            )}
          >
            収支
          </div>
          {columns.map((column) => (
            <div
              className={classNames(styles["col"], styles["col--footer"])}
              key={column.id}
            >
              {column.result}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
