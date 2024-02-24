import { Avatar, AvatarGroup } from "~/components/Avatar";
import { CardBody, CardHeader } from "~/components/Card";
import { Divider } from "~/components/Divider";
import { serverServices } from "~/lib/services/server";
import { dayjs } from "~/lib/utils/date";
import { getMatchResult } from "~/lib/utils/matchResult";
import { NavigationCard } from "./Card";
import { RankCountChart } from "./rankCountChart";

export async function MatchCard({
  matchId,
  date,
}: {
  matchId: string;
  date: string;
}) {
  const { getGames, getMatch, getUserProfile } = serverServices();
  const [match, games, userProfile] = await Promise.all([
    getMatch({ matchId }),
    getGames({ matchId }),
    getUserProfile(),
  ]);
  const matchResult = getMatchResult(match, games);

  const today = dayjs();
  const targetDate = dayjs(date);
  const isSameYear = today.isSame(targetDate, "year");
  const displayDate = isSameYear
    ? dayjs(date).format("M / D")
    : dayjs(date).format("YYYY / M / D");

  return (
    <NavigationCard matchId={matchId}>
      <CardHeader>
        <div className="flex w-full items-center justify-between">
          <p className="font-bold">{displayDate}</p>
          <AvatarGroup size="sm" isBordered max={4}>
            {match.players.map((player) => (
              <Avatar key={player.id} />
            ))}
          </AvatarGroup>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="h-[70px]">
          <RankCountChart
            matchResult={matchResult}
            userProfileId={userProfile.id}
          />
        </div>
      </CardBody>
    </NavigationCard>
  );
}
