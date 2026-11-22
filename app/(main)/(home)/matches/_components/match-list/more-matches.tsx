"use client";

import { Button, Typography } from "@heroui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MATCHES_PAGE_SIZE } from "@/lib/config";
import type { Match } from "@/lib/type";
import { MatchCard, MatchCardSkeleton } from "../match-card";

type Status = "idle" | "loading" | "error";

/**
 * 成績表一覧の 2 ページ目以降。末尾が画面に近づいたら `/api/matches` から続きを読み込む。
 * `after` は 1 ページ目の末尾の作成日時で、それより古い成績表を読み込む。
 */
export function MoreMatches({ after, userProfileId }: { after: string; userProfileId: string }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [status, setStatus] = useState<Status>("idle");

  const sentinelRef = useRef<HTMLLIElement>(null);
  // IntersectionObserver のコールバックが連続で発火しても二重に読み込まないためのフラグ
  const isLoadingRef = useRef(false);

  const before = matches.at(-1)?.createdAt ?? after;

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setStatus("loading");
    try {
      const response = await fetch(`/api/matches?before=${encodeURIComponent(before)}`);
      if (!response.ok) throw new Error(`Failed to load matches: ${response.status}`);
      const nextMatches: Match[] = await response.json();
      setMatches((prev) => [...prev, ...nextMatches]);
      // 取得件数が 1 ページ分に満たなければ、それ以上古い成績表はない
      setHasMore(nextMatches.length === MATCHES_PAGE_SIZE);
      setStatus("idle");
    } catch {
      setStatus("error");
    } finally {
      isLoadingRef.current = false;
    }
  }, [before]);

  const isError = status === "error";
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isError) return;
    // observe 直後にも判定されるため、読み込み後に末尾がまだ見えていれば続けて読み込む
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isError, loadMore]);

  return (
    <>
      {matches.map((match) => (
        <li key={match.id}>
          <MatchCard match={match} userProfileId={userProfileId} />
        </li>
      ))}
      {status === "loading" && (
        <li>
          <MatchCardSkeleton />
        </li>
      )}
      {isError && (
        <li className="my-6 flex flex-col items-center gap-2">
          <Typography type="body-sm" color="muted">
            読み込みに失敗しました。
          </Typography>
          <Button size="sm" variant="outline" onPress={() => void loadMore()}>
            再読み込み
          </Button>
        </li>
      )}
      {hasMore && <li ref={sentinelRef} aria-hidden className="h-px" />}
    </>
  );
}
