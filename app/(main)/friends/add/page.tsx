import { SearchField, Typography } from "@heroui/react";
import { Suspense } from "react";
import { User, UserSkeleton } from "@/components/user";
import { getFriends } from "@/lib/data/friend";
import { searchPlayers } from "@/lib/data/player";
import { AddFriendButton } from "./_components/add-friend-button";
import { BackButton } from "./_components/back-button";
import { FriendSearch } from "./_components/friend-search";

type SearchParams = Promise<{ query?: string }>;

export default function AddFriendPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-1">
        <BackButton />
        <Typography type="h1" className="heading-1">
          フレンド追加
        </Typography>
      </div>
      {/* useSearchParams は URL が分かるまで描画できないため Suspense が要る */}
      <Suspense fallback={<FriendSearchSkeleton />}>
        <FriendSearch />
      </Suspense>
      <Suspense fallback={null}>
        <SearchResultsSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SearchResultsSection({ searchParams }: { searchParams: SearchParams }) {
  const { query } = await searchParams;
  if (!query) return null;
  // 検索語が変わるたびに前の結果を残さず、スケルトンを出し直す
  return (
    <Suspense key={query} fallback={<SearchResultsSkeleton />}>
      <SearchResults query={query} />
    </Suspense>
  );
}

async function SearchResults({ query }: { query: string }) {
  const [players, friends] = await Promise.all([searchPlayers({ text: query }), getFriends()]);
  const friendIds = new Set(friends.map((f) => f.id));

  if (players.length === 0) {
    return (
      <Typography type="body-sm" color="muted" align="center" className="mt-10">
        見つかりませんでした
      </Typography>
    );
  }

  return (
    <ul className="mt-1">
      {players.map(({ id, name, displayId, avatarUrl }) => (
        <li key={id} className="flex items-center justify-between py-2">
          <User name={name} displayId={displayId} avatarUrl={avatarUrl} />
          {friendIds.has(id) ? (
            <div className="w-16 text-center text-xs text-muted">追加済み</div>
          ) : (
            <AddFriendButton profileId={id} />
          )}
        </li>
      ))}
    </ul>
  );
}

function FriendSearchSkeleton() {
  return (
    <SearchField aria-label="ユーザーIDもしくは名前で検索" variant="secondary" isDisabled>
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input placeholder="ユーザーIDもしくは名前で検索" />
      </SearchField.Group>
    </SearchField>
  );
}

function SearchResultsSkeleton() {
  return (
    <ul className="mt-1" aria-busy="true">
      {Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((id) => (
        <li key={id} className="flex items-center justify-between py-2">
          <UserSkeleton />
        </li>
      ))}
    </ul>
  );
}
