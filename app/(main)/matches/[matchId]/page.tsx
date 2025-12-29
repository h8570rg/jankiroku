import { Suspense } from "react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { LinkButton } from "@/components/LinkButton";
import { ChipModal, ChipModalTrigger } from "./_components/ChipModal";
import { MatchContextProvider } from "./_components/ContextProvider";
import { DataModal, DataModalTrigger } from "./_components/DataModal";
import { GameModal } from "./_components/GameModal";
import { MatchTable } from "./_components/MatchTable";
import { PlayersModal, PlayersModalTrigger } from "./_components/PlayersModal";
import { RuleModal, RuleModalTrigger } from "./_components/RuleModal";

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
				<div className="mb-1 flex items-center justify-between">
					<div className="flex items-center gap-1">
						<LinkButton isIconOnly variant="light" href="/matches">
							<Icon className="size-4 fill-current" name="back" />
						</LinkButton>
						{/* TODO: fetch */}
						{/* <p>{displayDate}</p> */}
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
