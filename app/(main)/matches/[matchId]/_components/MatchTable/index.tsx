import classNames from "classnames";
import type { CSSProperties } from "react";
import { Icon } from "@/components/Icon";
import { serverServices } from "@/lib/services/server";
import type { MatchPlayer } from "@/lib/type";
import { ChipModalTrigger } from "../ChipModal";
import { GameModalTrigger } from "../GameModal";
import { PlayersModalTrigger } from "../PlayersModal";
import { GameRow } from "./GameRow";

type Column = {
	id: string;
	displayId: string | null;
	name: string | null;
	type: "index" | "player" | "empty";
} & MatchPlayer;

type Row = {
	gameId: string;
	players: { [playerId: Column["id"]]: number };
};

export async function MatchTable({
	matchId,
	className,
}: {
	matchId: string;
	className?: string;
}) {
	const { getMatch } = await serverServices();
	const [match] = await Promise.all([getMatch({ matchId })]);
	const { rule, players } = match;
	const { playersCount } = rule;

	const playersShortCount = playersCount - players.length;
	const isPlayersShort = playersShortCount > 0;

	const columns: Column[] = [
		...players.map(
			(player) =>
				({
					...player,
					type: "player",
				}) as const,
		),
		...Array.from({ length: playersShortCount }).map(
			(_, i) =>
				({
					id: `player-${i}`,
					displayId: "",
					name: "",
					type: "empty",
					rankCounts: [0] as number[],
					averageRank: 0,
					totalScore: 0,
					chipCount: null,
					result: 0,
				}) as const,
		),
	];

	const gameRows: Row[] =
		match.games?.map((game) => ({
			gameId: game.id,
			players: Object.fromEntries(
				game.players.map((player) => [player.id, player.score]),
			),
		})) ?? [];

	const rowStyle: CSSProperties = {
		display: "grid",
		gridTemplateColumns: `46px repeat(${columns.length}, minmax(56px, 1fr))`,
		width: "100%",
	};

	return (
		<div className={classNames(className, "overflow-x-auto pb-4")}>
			<div className="flex h-full min-w-fit flex-col">
				{/* ヘッダー */}
				<PlayersModalTrigger
					style={rowStyle}
					className="mb-1 rounded-lg bg-default-100 text-foreground-500"
				>
					<div />
					{columns.map((column) => (
						<div key={column?.id} className="truncate px-1 py-3 text-tiny">
							{column.name}
						</div>
					))}
				</PlayersModalTrigger>
				{/* ボディ */}
				<div className="grow">
					{gameRows.length === 0 && (
						<p className="my-10 text-center text-small text-foreground-light">
							まだデータはありません
						</p>
					)}
					{gameRows.length > 0 &&
						gameRows.map((item, index) => (
							<GameRow
								key={item.gameId}
								index={index}
								matchId={matchId}
								gameId={item.gameId}
								style={rowStyle}
							>
								<div className="flex h-full items-center justify-center break-all px-1 py-2 text-tiny text-default-500">
									{index + 1}
								</div>
								{columns.map((column) => (
									<div
										key={column.id}
										className={classNames(
											"flex h-full items-center justify-center break-all px-1 py-2 text-center text-small",
											{
												"text-danger": item.players[column.id] < 0,
											},
										)}
									>
										{item.players[column.id]}
									</div>
								))}
							</GameRow>
						))}
					<GameModalTrigger
						className="mt-1"
						fullWidth
						size="lg"
						startContent={<Icon className="size-5" name="edit" />}
						variant="ghost"
						isPlayersShort={isPlayersShort}
					>
						結果を入力する
					</GameModalTrigger>
				</div>
				{/* フッター */}
				<div className="mt-3 rounded-lg bg-default-100 text-foreground-500">
					<div className="min-h-10" style={rowStyle}>
						<div className="flex h-full items-center justify-center truncate break-all px-1 py-3 text-tiny">
							合計
						</div>
						{columns.map((column) => (
							<div
								className={classNames(
									"flex h-full items-center justify-center px-1 text-center text-tiny",
									{
										"text-danger": column.totalScore < 0,
									},
								)}
								key={column.id}
							>
								{column.totalScore}
							</div>
						))}
					</div>
					<ChipModalTrigger className="min-h-10" style={rowStyle}>
						<div className="flex h-full items-center justify-center truncate px-1 text-tiny">
							チップ
						</div>
						{columns.map((column) => (
							<div
								className="flex h-full items-center justify-center break-all px-1 py-3 text-center text-tiny"
								key={column.id}
							>
								{column.chipCount}
								{column.chipCount !== null && (
									<span className="text-[10px]">枚</span>
								)}
							</div>
						))}
					</ChipModalTrigger>
					<div className="min-h-10" style={rowStyle}>
						<div className="flex h-full items-center justify-center truncate px-1 text-tiny">
							収支
						</div>
						{columns.map((column) => (
							<div
								className="flex h-full items-center justify-center break-all px-1 py-3 text-center text-tiny"
								key={column.id}
							>
								{column.result}
								<span className="contents text-[10px]">円</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
