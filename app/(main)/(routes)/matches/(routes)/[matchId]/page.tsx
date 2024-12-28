import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { ChipModal, ChipModalTrigger } from "./(components)/ChipModal";
import { MatchContextProvider } from "./(components)/ContextProvider";
import { DataModal, DataModalTrigger } from "./(components)/DataModal";
import { GameModal } from "./(components)/GameModal";
import { MatchTable } from "./(components)/MatchTable";
import { PlayersModal, PlayersModalTrigger } from "./(components)/PlayersModal";
import { RuleModal, RuleModalTrigger } from "./(components)/RuleModal";

export default async function Match({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;

  // Modalの開閉のたびに実行されるのでここでfetchしないこと

  return (
    <MatchContextProvider>
      <div className="flex h-full flex-col pb-5">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button isIconOnly variant="light" as={Link} href="/matches">
              <Icon className="size-4 fill-current" name="back" />
            </Button>
            {/* TODO: fetch */}
            {/* <p className="font-bold">{displayDate}</p> */}
          </div>
          <div className="flex items-center gap-0.5">
            <Button isIconOnly variant="light" as={DataModalTrigger}>
              <Icon className="size-5 fill-current" name="bar-chart" />
            </Button>
            <Button isIconOnly variant="light" as={RuleModalTrigger}>
              <Icon className="size-5 fill-current" name="description" />
            </Button>
            <Button isIconOnly variant="light" as={ChipModalTrigger}>
              <Icon className="size-5 fill-current" name="chip" />
            </Button>
            <Button isIconOnly variant="light" as={PlayersModalTrigger}>
              <Icon className="size-5 fill-current" name="personAdd" />
            </Button>
          </div>
        </div>
        <Suspense fallback={null}>
          <MatchTable className="grow" matchId={matchId} />
        </Suspense>
        <Suspense fallback={null}>
          <PlayersModal matchId={matchId} />
        </Suspense>
        <Suspense fallback={null}>
          <GameModal matchId={matchId} />
        </Suspense>
        <Suspense fallback={null}>
          <ChipModal matchId={matchId} />
        </Suspense>
        <Suspense fallback={null}>
          <RuleModal matchId={matchId} />
        </Suspense>
        <Suspense fallback={null}>
          <DataModal matchId={matchId} />
        </Suspense>
      </div>
    </MatchContextProvider>
  );
}
