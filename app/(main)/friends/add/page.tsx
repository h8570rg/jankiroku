import { Suspense } from "react";
import { User } from "@/components/user";
import { serverServices } from "@/lib/services/server";
import { AddFriendButton } from "./_components/add-friend-button";
import { BackButton } from "./_components/back-button";
import { FriendSearch } from "./_components/friend-search";

export default async function AddFriendPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;

  const { searchProfiles } = await serverServices();
  const profiles = query ? await searchProfiles({ text: query }) : [];

  return (
    <div>
      <div className="mb-4 flex items-center gap-1">
        <BackButton />
        <h1 className="heading-1">フレンド追加</h1>
      </div>
      <Suspense>
        <FriendSearch defaultValue={query ?? ""} />
      </Suspense>
      <ul className="mt-1">
        {!!query && profiles.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted">
            見つかりませんでした
          </p>
        )}
        {profiles.map(({ id, name, displayId, isFriend }) => (
          <li key={id} className="flex items-center justify-between py-2">
            <User name={name} displayId={displayId} />
            {isFriend ? (
              <div className="w-16 text-center text-xs text-muted">
                追加済み
              </div>
            ) : (
              <AddFriendButton profileId={id} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
