import Link from "next/link";
import { Suspense } from "react";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { serverServices } from "~/lib/services/server";
import { dayjs } from "~/lib/utils/date";
import { ChipInputModal } from "./ChipInputModal";
import { GameInputModal } from "./GameInputModal";
import { MatchPlayerInputModal } from "./MatchPlayerInputModal";
import { MatchTable } from "./MatchTable";

export default async function Match({
  params: { matchId },
}: {
  params: { matchId: string };
}) {
  const { getGames, getMatch, getMatchChips } = serverServices();
  const [match, games, chips] = await Promise.all([
    getMatch({ matchId }),
    getGames({ matchId }),
    getMatchChips({ matchId }),
  ]);

  const { date } = match;

  const today = dayjs();
  const targetDate = dayjs(date);
  const isSameYear = today.isSame(targetDate, "year");
  const displayDate = isSameYear
    ? dayjs(date).format("M/D")
    : dayjs(date).format("YYYY/M/D");

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button isIconOnly variant="light" as={Link} href="/matches">
            <Icon className="size-4 fill-current" name="back" />
          </Button>
          <p className="font-bold">{displayDate}</p>
        </div>
        <div className="flex items-center gap-0.5">
          <Button isIconOnly variant="light">
            <Icon className="size-5 fill-current" name="personAdd" />
          </Button>
        </div>
      </div>
      <MatchTable match={match} games={games} chips={chips} />
      <Suspense fallback={null}>
        <MatchPlayerInputModal matchId={matchId} />
      </Suspense>
      <Suspense fallback={null}>
        <GameInputModal matchId={matchId} />
      </Suspense>
      <Suspense fallback={null}>
        <ChipInputModal matchId={matchId} />
      </Suspense>
    </div>
  );
}
