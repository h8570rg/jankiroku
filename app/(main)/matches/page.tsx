import { Text } from "@heroui/react";
import { serverServices } from "@/lib/services/server";
import { CreateMatchButton } from "./_components/create-match-button";
import { MatchCard } from "./_components/match-card";

export default async function Matches() {
  const { getMatches, getUserProfile, getFriends } = await serverServices();

  // TODO: infinite scroll
  const [matches, userProfile, friends] = await Promise.all([
    getMatches({}),
    getUserProfile(),
    getFriends(),
  ]);
  return (
    <div>
      <Text type="h1" className="heading-1 mb-1">
        成績表
      </Text>
      {matches.length === 0 && (
        <Text type="body-sm" color="muted" align="center" className="my-10">
          まだ成績表がありません。
        </Text>
      )}
      <ul className="space-y-4">
        {matches?.map((match) => (
          <li key={match.id}>
            <MatchCard match={match} userId={userProfile.id} />
          </li>
        ))}
      </ul>
      <div
        className="
          sticky inset-x-0 bottom-0 z-10 bg-linear-to-t from-background p-4
        "
      >
        <CreateMatchButton
          className="w-full"
          friends={friends}
          userProfile={userProfile}
        />
      </div>
    </div>
  );
}
