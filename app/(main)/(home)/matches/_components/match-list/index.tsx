import { MATCHES_PAGE_SIZE } from "@/lib/config";
import type { Match } from "@/lib/type";
import { MatchCard } from "../match-card";
import { MoreMatches } from "./more-matches";

/**
 * 成績表一覧。1 ページ目は Server Component から受け取った `initialMatches` をそのまま表示し、
 * 2 ページ目以降は `MoreMatches` が読み込んで持つ。
 */
export function MatchList({
  initialMatches,
  userProfileId,
}: {
  initialMatches: Match[];
  userProfileId: string;
}) {
  // 1 ページ分に満たなければ、それ以上古い成績表はない。
  // created_at はマイクロ秒精度のため、Date を経由せず文字列のまま cursor にする
  const cursor =
    initialMatches.length === MATCHES_PAGE_SIZE ? initialMatches.at(-1)?.createdAt : undefined;

  return (
    <ul className="space-y-4">
      {initialMatches.map((match) => (
        <li key={match.id}>
          <MatchCard match={match} userProfileId={userProfileId} />
        </li>
      ))}
      {/*
        Cache Components では一覧から離れてもアンマウントされず、読み込んだ続きが残る。
        成績表が増えて 1 ページ目の末尾がずれたら、key が変わって続きを捨てる（重複や抜けを防ぐ）
      */}
      {cursor && <MoreMatches key={cursor} after={cursor} userProfileId={userProfileId} />}
    </ul>
  );
}
