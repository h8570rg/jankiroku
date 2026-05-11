import { Text } from "@heroui/react";
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
        <Text type="h1" className="heading-1">
          フレンド追加
        </Text>
      </div>
      <Suspense>
        <FriendSearch defaultValue={query ?? ""} />
      </Suspense>
      <ul className="mt-1">
        {!!query && profiles.length === 0 && (
          <Text type="body-sm" color="muted" align="center" className="mt-10">
            見つかりませんでした
          </Text>
        )}
        {profiles.map(({ id, name, displayId, avatarUrl, isFriend }) => (
          <li key={id} className="flex items-center justify-between py-2">
            <User name={name} displayId={displayId} avatarUrl={avatarUrl} />
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
