import { Rule } from "../services/features/match";
import { CalcMethod } from "./schemas";

export function calcPlayerScores({
  playerPoints,
  rule,
  crackBoxPlayerId,
}: {
  playerPoints: {
    profileId: string;
    points: number;
  }[];
  rule: Rule;
  crackBoxPlayerId?: string;
}): {
  profileId: string;
  score: number;
}[] {
  if (rule.playersCount !== playerPoints.length) {
    throw new Error("Invalid players count");
  }
  const sortedPlayerPoints = playerPoints.sort((a, b) => b.points - a.points);
  const crackedBoxPlayersCount = sortedPlayerPoints.filter(
    ({ points }) => points < 0,
  ).length;
  const totalCrackBoxBonus = crackBoxPlayerId
    ? rule.crackBoxBonus * crackedBoxPlayersCount
    : 0;
  const scores = sortedPlayerPoints.map(({ profileId, points }, index) => {
    // 飛ばしたプレイヤーかどうか
    const isCrackBoxPlayer = profileId === crackBoxPlayerId;
    // 飛ばされたプレイヤーかどうか
    const isCrackedBoxPlayer = points < 0 && !!crackBoxPlayerId;
    // 飛び賞
    const crackBoxBonusPoints = isCrackedBoxPlayer
      ? -1 * rule.crackBoxBonus
      : isCrackBoxPlayer
        ? totalCrackBoxBonus
        : 0;
    const score = calcScore({ points, index, rule, crackBoxBonusPoints });
    return {
      profileId,
      score,
    };
  });

  // scoresの先頭以外のscoreの合計
  const totalScoreWithoutFirstPlace = scores
    .slice(1)
    .reduce((acc, { score }) => acc + score, 0);

  scores[0].score = -1 * totalScoreWithoutFirstPlace;

  return scores;
}

export function calcScore({
  points,
  index,
  rule,
  crackBoxBonusPoints,
}: {
  points: number;
  index: number;
  rule: Rule;
  crackBoxBonusPoints: number;
}) {
  const { defaultCalcPoints, calcMethod, incline } = rule;
  const { incline1, incline2, incline3, incline4 } = incline;
  const _incline = [incline1, incline2, incline3, incline4][index];

  // 端数計算
  const roundedPoints = calcRound({ points, calcMethod });

  // オカ、飛び賞計算
  const substantialPoints =
    roundedPoints - defaultCalcPoints + crackBoxBonusPoints;

  const score = substantialPoints / 1000 + _incline;
  return score;
}

export function calcRound({
  points,
  calcMethod,
}: {
  points: number;
  calcMethod: CalcMethod;
}) {
  switch (calcMethod) {
    case "round":
      return round(points);
    case "roundOff":
      return roundOff(points);
    case "roundDown":
      return roundDown(points);
    case "roundUp":
      return roundUp(points);
  }
}

// 五捨六入
export function round(points: number) {
  if (points >= 0) {
    if (points % 1000 < 600) {
      return Math.floor(points / 1000) * 1000;
    } else {
      return Math.ceil(points / 1000) * 1000;
    }
  } else {
    if (points % 1000 <= -600) {
      return Math.floor(points / 1000) * 1000;
    } else {
      return Math.ceil(points / 1000) * 1000 + 0;
    }
  }
}

// 四捨五入
export function roundOff(points: number) {
  if (points >= 0) {
    return Math.round(points / 1000) * 1000;
  } else {
    return -1 * Math.round((-1 * points) / 1000) * 1000 + 0;
  }
}

// 切り捨て
export function roundDown(points: number) {
  if (points >= 0) {
    return Math.floor(points / 1000) * 1000;
  } else {
    return Math.ceil(points / 1000) * 1000 + 0;
  }
}

// 切り上げ
export function roundUp(points: number) {
  if (points >= 0) {
    return Math.ceil(points / 1000) * 1000;
  } else {
    return Math.floor(points / 1000) * 1000 + 0;
  }
}
