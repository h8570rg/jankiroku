import { Typography } from "@heroui/react";
import { Suspense } from "react";
import { User } from "@/components/user";
import { getFriends } from "@/lib/data/friend";
import { searchPlayers } from "@/lib/data/player";
import { AddFriendButton } from "./_components/add-friend-button";
import { BackButton } from "./_components/back-button";
import { FriendSearch } from "./_components/friend-search";

// TODO(#150): Cache Components 移行のため一時的にブロッキングを許可している。
// Suspense 境界を整理したら外す。https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function AddFriendPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;

  const [players, friends] = query
    ? await Promise.all([searchPlayers({ text: query }), getFriends()])
    : [[], []];
  const friendIds = new Set(friends.map((f) => f.id));

  return (
    <div>
      <div className="mb-4 flex items-center gap-1">
        <BackButton />
        <Typography type="h1" className="heading-1">
          フレンド追加
        </Typography>
      </div>
      <Suspense>
        <FriendSearch defaultValue={query ?? ""} />
      </Suspense>
      <ul className="mt-1">
        {!!query && players.length === 0 && (
          <Typography type="body-sm" color="muted" align="center" className="mt-10">
            見つかりませんでした
          </Typography>
        )}
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
    </div>
  );
}
