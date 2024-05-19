import { calcMethods } from "./config";

export type Profile = {
  id: string;
  name: string | null;
  janrecoId: string | null;
  isUnregistered?: boolean;
  isAnonymous?: boolean;
  isFriend?: boolean;
};

export type Match = {
  id: string;
  createdAt: string;
  players: MatchPlayer[];
  rule: Rule;
  games: Game[];
};

export type MatchPlayer = Profile & {
  rankCounts: number[];
  averageRank: number;
  totalScore: number;
  chipCount: number | null;
};

export type CalcMethod = (typeof calcMethods)[number];

export type Rule = {
  playersCount: number;
  defaultPoints: number;
  defaultCalcPoints: number;
  rate: number;
  chipRate: number;
  crackBoxBonus: number;
  calcMethod: CalcMethod;
  incline: {
    incline1: number;
    incline2: number;
    incline3: number;
    incline4: number;
  };
};

export type GamePlayer = {
  id: string;
  score: number;
  rank: number;
};

export type Game = {
  players: GamePlayer[];
};
