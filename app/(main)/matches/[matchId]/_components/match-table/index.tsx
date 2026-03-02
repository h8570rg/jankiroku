import { cn } from "@heroui/react";
import { Pencil } from "lucide-react";
import type { CSSProperties } from "react";
import { serverServices } from "@/lib/services/server";
import type { MatchPlayer } from "@/lib/type";
import { ChipRow } from "./chip-row";
import { GameModalSection } from "./game-modal-section";
import { GameRow } from "./game-row";
import { PlayersRow } from "./players-row";

type Column = {
  id: string;
  displayId: string | null;
  name: string | null;
  type: "index" | "player" | "empty";
} & MatchPlayer;

type Row = {
  gameId: string;
  players: { [playerId: Column["id"]]: number };
};

export async function MatchTable({
  matchId,
  className,
}: {
  matchId: string;
  className?: string;
}) {
  const { getFriends, getMatch } = await serverServices();
  const [friends, match] = await Promise.all([
    getFriends(),
    getMatch({ matchId }),
  ]);
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
          displayId: "",
          name: "",
          type: "empty",
          rankCounts: [0] as number[],
          averageRank: 0,
          totalScore: 0,
          chipCount: null,
          result: 0,
        }) as const,
    ),
  ];

  const gameRows: Row[] =
    match.games?.map((game) => ({
      gameId: game.id,
      players: Object.fromEntries(
        game.players.map((player) => [player.id, player.score]),
      ),
    })) ?? [];

  const rowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `46px repeat(${columns.length}, minmax(56px, 1fr))`,
    width: "100%",
  };

  return (
    <div className={cn(className, "overflow-x-auto pb-4")}>
      <div className="flex h-full min-w-fit flex-col">
        {/* ヘッダー */}
        <PlayersRow
          style={rowStyle}
          className="mb-1 rounded-3xl bg-surface text-muted"
          matchId={matchId}
          friends={friends}
          players={players}
          isDefaultOpen={players.length <= 1}
        >
          <div />
          {columns.map((column) => (
            <div key={column?.id} className="truncate px-1 py-3 text-xs">
              {column.name}
            </div>
          ))}
        </PlayersRow>
        {/* ボディ */}
        <div className="grow">
          {gameRows.length === 0 && (
            <p className="my-10 text-center text-sm text-muted">
              まだデータはありません
            </p>
          )}
          {gameRows.length > 0 &&
            gameRows.map((item, index) => (
              <GameRow
                key={item.gameId}
                index={index}
                matchId={matchId}
                gameId={item.gameId}
                style={rowStyle}
              >
                <div
                  className="
                    flex h-full items-center justify-center px-1 py-2 text-xs
                    break-all text-muted
                  "
                >
                  {index + 1}
                </div>
                {columns.map((column) => (
                  <div
                    key={column.id}
                    className={cn(
                      `
                        flex h-full items-center justify-center px-1 py-2
                        text-center text-sm break-all
                      `,
                      {
                        "text-danger": item.players[column.id] < 0,
                      },
                    )}
                  >
                    {item.players[column.id]}
                  </div>
                ))}
              </GameRow>
            ))}
          <GameModalSection
            match={match}
            isPlayersShort={isPlayersShort}
            className="mt-1"
            fullWidth
            size="lg"
            variant="outline"
          >
            <Pencil />
            結果を入力する
          </GameModalSection>
        </div>
        {/* フッター */}
        <div className="mt-3 rounded-3xl bg-surface text-muted">
          <div className="min-h-10" style={rowStyle}>
            <div
              className="
                flex h-full items-center justify-center truncate px-1 py-3
                text-xs break-all
              "
            >
              合計
            </div>
            {columns.map((column) => (
              <div
                className={cn(
                  `
                    flex h-full items-center justify-center px-1 text-center
                    text-xs
                  `,
                  {
                    "text-danger": column.totalScore < 0,
                  },
                )}
                key={column.id}
              >
                {column.totalScore}
              </div>
            ))}
          </div>
          <ChipRow className="min-h-10" style={rowStyle} match={match}>
            <div
              className="
                flex h-full items-center justify-center truncate px-1 text-xs
              "
            >
              チップ
            </div>
            {columns.map((column) => (
              <div
                className="
                  flex h-full items-center justify-center px-1 py-3 text-center
                  text-xs break-all
                "
                key={column.id}
              >
                {column.chipCount}
                {column.chipCount !== null && (
                  <span className="text-[10px]">枚</span>
                )}
              </div>
            ))}
          </ChipRow>
          <div className="min-h-10" style={rowStyle}>
            <div
              className="
                flex h-full items-center justify-center truncate px-1 text-xs
              "
            >
              収支
            </div>
            {columns.map((column) => (
              <div
                className="
                  flex h-full items-center justify-center px-1 py-3 text-center
                  text-xs break-all
                "
                key={column.id}
              >
                {column.result}
                <span className="contents text-[10px]">円</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
