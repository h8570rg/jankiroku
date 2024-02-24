import { Game } from "~/lib/services/game";
import { Match } from "../services/match";

export type MatchResult = {
  [profileId: string]: {
    rankCounts: number[];
    averageRank: number;
    totalPoints: number;
  };
};

export function getMatchResult(match: Match, games: Game[]): MatchResult {
  // 値の入っていない結果を作成
  const matchResult: MatchResult = Object.fromEntries(
    match.players.map((player) => [
      player.id,
      {
        rankCounts: new Array(match.rule.playersCount).fill(0),
        averageRank: NaN,
        totalPoints: 0,
      },
    ]),
  );

  // rankCounts と totalPoints を更新
  games.reduce((acc, game) => {
    // 1着から順番に並び替え
    const sortedScores = game.scores.sort((a, b) => b.score - a.score);
    // それぞれのプレイヤーの rankCounts と totalPoints を更新
    sortedScores.forEach((score, index) => {
      acc[score.profileId].rankCounts[index] += 1;
      acc[score.profileId].totalPoints += score.score;
    });
    return acc;
  }, matchResult);

  // averageRank を更新
  Object.entries(matchResult).forEach(([profileId, result]) => {
    const { rankCounts } = result;
    // 参加したゲーム数
    const gameCount = rankCounts.reduce((acc, count) => acc + count, 0);
    // 平均順位
    const averageRank =
      rankCounts.reduce((acc, count, rank) => {
        return acc + (rank + 1) * count;
      }, 0) / gameCount;
    matchResult[profileId].averageRank = averageRank;
  });

  return matchResult;
}
