import { Typography } from "@heroui/react";
import { Suspense } from "react";
import { Button } from "@/components/button";
import { MATCHES_PAGE_SIZE } from "@/lib/config";
import { getFriends } from "@/lib/data/friend";
import { getMatches } from "@/lib/data/match";
import { getUserProfile } from "@/lib/data/user";
import { CreateMatchButton } from "../../matches/_components/create-match-button";
import { MatchCardSkeleton } from "./_components/match-card";
import { MatchList } from "./_components/match-list";

export default function Matches() {
  return (
    <div>
      <Suspense fallback={<MatchListSkeleton />}>
        <MatchListSection />
      </Suspense>
      <div className="sticky inset-x-0 bottom-0 z-10 bg-linear-to-t from-background p-4">
        {/* 作成ボタンが使うフレンド一覧を、成績表一覧の表示まで待たせない */}
        <Suspense
          fallback={
            <Button className="w-full" size="lg" variant="primary" isDisabled>
              ゲームを始める
            </Button>
          }
        >
          <CreateMatchSection />
        </Suspense>
      </div>
    </div>
  );
}

async function MatchListSection() {
  const [initialMatches, userProfile] = await Promise.all([
    getMatches({ limit: MATCHES_PAGE_SIZE }),
    getUserProfile(),
  ]);
  return (
    <>
      {initialMatches.length === 0 && (
        <Typography type="body-sm" color="muted" align="center" className="my-10">
          まだ成績表がありません。
        </Typography>
      )}
      <MatchList initialMatches={initialMatches} userProfileId={userProfile.id} />
    </>
  );
}

async function CreateMatchSection() {
  const [userProfile, friends] = await Promise.all([getUserProfile(), getFriends()]);
  return <CreateMatchButton className="w-full" friends={friends} userProfile={userProfile} />;
}

function MatchListSkeleton() {
  return (
    <ul className="space-y-4" aria-busy="true">
      {Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((id) => (
        <li key={id}>
          <MatchCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
