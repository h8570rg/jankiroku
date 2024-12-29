import { User as SupabaseUser } from "@supabase/supabase-js";
import { calcMethods, chipRates, rates } from "./config";

export type User = SupabaseUser;

export type Profile = {
  id: string;
  name: string | null;
  displayId: string | null;
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
  averageRank: number | null;
  totalScore: number;
  chipCount: number | null;
  result: number;
};

export type CalcMethod = (typeof calcMethods)[number];
export type Rate = (typeof rates)[number];
export type ChipRate = (typeof chipRates)[number];

export type Rule = {
  playersCount: number;
  defaultPoints: number;
  defaultCalcPoints: number;
  rate: Rate;
  chipRate: ChipRate;
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
  id: string;
  players: GamePlayer[];
};
