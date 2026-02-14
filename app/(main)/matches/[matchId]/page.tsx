import { Suspense } from "react";
import { ChipModal } from "./_components/chip-modal";
import { MatchContextProvider } from "./_components/context-provider";
import { DataModal } from "./_components/data-modal";
import { GameModal } from "./_components/game-modal";
import { MatchHeader } from "./_components/match-header";
import { MatchTable } from "./_components/match-table";
import { PlayersModal } from "./_components/players-modal";
import { RuleModal } from "./_components/rule-modal";

export default async function Match({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;

  // Modalの開閉のたびに実行されるのでここでfetchしないこと

  return (
    <MatchContextProvider>
      <div className="flex h-full flex-col">
        <MatchHeader />
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
