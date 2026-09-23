import type { Game, MatchPlayer, Player } from "@/lib/type";

/**
 * マッチ参加者の試合成績（順位回数・平均順位・合計スコア・収支）を算出する。
 * 永続化 shape の変換は `lib/data/match` 側の責務。
 */
export function aggregateMatchPlayerStats({
  players,
  games,
  playersCount,
  chipRate,
  rate,
}: {
  players: (Player & { chipCount: number | null })[];
  games: Game[];
  playersCount: number;
  chipRate: number;
  rate: number;
}): MatchPlayer[] {
  const matchPlayers: MatchPlayer[] = players.map((player) => ({
    ...player,
    rankCounts: Array.from({ length: playersCount }, () => 0),
    averageRank: null,
    totalScore: 0,
    result: 0,
  }));

  games.forEach(({ players: gamePlayers }) => {
    gamePlayers.forEach(({ id, score, rank }) => {
      const player = matchPlayers.find((p) => p.id === id);
      if (!player) return;
      player.rankCounts[rank - 1]++;
      player.totalScore += score;
    });
  });

  matchPlayers.forEach((player) => {
    const gamesPlayed = player.rankCounts.reduce((acc, cur) => acc + cur, 0);
    if (gamesPlayed > 0) {
      player.averageRank = (
        player.rankCounts.reduce((acc, cur, index) => acc + cur * (index + 1), 0) / gamesPlayed
      ).toFixed(2);
    }
    player.result = (player.chipCount ?? 0) * chipRate + player.totalScore * rate * 10;
  });

  return matchPlayers;
}
