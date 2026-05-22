import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { calcMethods, rates } from "./config";

export type User = SupabaseUser;

/**
 * マッチ参加者・フレンド・検索結果として登場するプレイヤー。
 * 登録済みユーザーとゲストの両方を含む。
 *
 * - `displayId`: 登録済みなら値あり、ゲストは `null`
 * - `avatarUrl`: 登録済みでアップロード有りなら値あり、未アップロードまたはゲストは `null`
 *
 * 「値なし」は一貫して `null` で表現する (DB NULL と整合)。
 * `UserProfile` は構造的サブタイプとしてここに渡せる。
 */
export type Player = {
  id: string;
  name: string;
  displayId: string | null;
  avatarUrl: string | null;
};

/**
 * 自分のアカウント情報。
 * layout で未登録ユーザーは `/register` に redirect されるため、
 * (main) 配下では必ず登録済みとして扱える。
 */
export type UserProfile = {
  id: string;
  name: string;
  displayId: string;
  avatarUrl: string | null;
  userId: string;
};

export type Match = {
  id: string;
  createdAt: string;
  players: MatchPlayer[];
  rule: Rule;
  games: Game[];
};

/**
 * マッチ参加者個別の試合成績を伴うプレイヤー。
 */
export type MatchPlayer = Player & {
  rankCounts: number[];
  averageRank: string | null;
  totalScore: number;
  chipCount: number | null;
  result: number;
};

export type CalcMethod = (typeof calcMethods)[number];
export type Rate = (typeof rates)[number];

export type Rule = {
  playersCount: number;
  defaultPoints: number;
  defaultCalcPoints: number;
  rate: Rate;
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
  id: string;
  players: GamePlayer[];
};
