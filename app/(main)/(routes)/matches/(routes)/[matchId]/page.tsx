import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { serverServices } from "@/lib/services/server";
import { dayjs } from "@/lib/utils/date";
import { ChipInputButton } from "./(components)/ChipInputButton";
import { ChipInputModal } from "./(components)/ChipInputModal";
import { GameInputModal } from "./(components)/GameInputModal";
import { MatchPlayerInputButton } from "./(components)/MatchPlayerInputButton";
import { MatchPlayerInputModal } from "./(components)/MatchPlayerInputModal";
import { MatchTable } from "./(components)/MatchTable";
import { RuleModal, RuleModalTrigger } from "./(components)/RuleModal";

export default async function Match({
  params: { matchId },
}: {
  params: { matchId: string };
}) {
  const { getMatch } = serverServices();
  const match = await getMatch({ matchId });

  const { createdAt } = match;

  const today = dayjs();
  const targetDate = dayjs(createdAt);
  const isSameYear = today.isSame(targetDate, "year");
  const displayDate = isSameYear
    ? dayjs(createdAt).format("M/D")
    : dayjs(createdAt).format("YYYY/M/D");

  // プレイヤー入力モーダルを初期状態で開くかどうか
  const isMatchPlayerInputModalDefaultOpen = match.players.length <= 1;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button isIconOnly variant="light" as={Link} href="/matches">
            <Icon className="size-4 fill-current" name="back" />
          </Button>
          <p className="font-bold">{displayDate}</p>
        </div>
        <div className="flex items-center gap-0.5">
          <Button isIconOnly variant="light" as={RuleModalTrigger}>
            <Icon className="size-5 fill-current" name="description" />
          </Button>
          <ChipInputButton isIconOnly variant="light">
            <Icon className="size-5 fill-current" name="chip" />
          </ChipInputButton>
          <MatchPlayerInputButton isIconOnly variant="light">
            <Icon className="size-5 fill-current" name="personAdd" />
          </MatchPlayerInputButton>
        </div>
      </div>
      <Suspense fallback={null}>
        <MatchTable className="grow" matchId={matchId} />
      </Suspense>
      <Suspense fallback={null}>
        <MatchPlayerInputModal
          matchId={matchId}
          defaultOpen={isMatchPlayerInputModalDefaultOpen}
        />
      </Suspense>
      <Suspense fallback={null}>
        <GameInputModal matchId={matchId} />
      </Suspense>
      <Suspense fallback={null}>
        <ChipInputModal matchId={matchId} />
      </Suspense>
      <RuleModal rule={match.rule} />
    </div>
  );
}
