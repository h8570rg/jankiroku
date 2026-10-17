import { Typography } from "@heroui/react";
import { MATCHES_PAGE_SIZE } from "@/lib/config";
import { getFriends } from "@/lib/data/friend";
import { getMatches } from "@/lib/data/match";
import { getUserProfile } from "@/lib/data/user";
import { CreateMatchButton } from "../../matches/_components/create-match-button";
import { MatchList } from "./_components/match-list";

export default async function Matches() {
  const [initialMatches, userProfile, friends] = await Promise.all([
    getMatches({ limit: MATCHES_PAGE_SIZE }),
    getUserProfile(),
    getFriends(),
  ]);
  return (
    <div>
      {initialMatches.length === 0 && (
        <Typography type="body-sm" color="muted" align="center" className="my-10">
          まだ成績表がありません。
        </Typography>
      )}
      <MatchList initialMatches={initialMatches} userProfileId={userProfile.id} />
      <div className="sticky inset-x-0 bottom-0 z-10 bg-linear-to-t from-background p-4">
        <CreateMatchButton className="w-full" friends={friends} userProfile={userProfile} />
      </div>
    </div>
  );
}
