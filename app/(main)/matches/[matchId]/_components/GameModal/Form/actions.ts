"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { serverServices } from "@/lib/services/server";
import type { Rule } from "@/lib/type";
import { schema } from "@/lib/utils/schema";
import { calcPlayerScores } from "@/lib/utils/score";

type AddGameState = {
	success?: boolean;
	errors?: {
		base?: string[];
		players?: string[];
		crackBoxPlayerId?: string[];
	};
};

const addGameSchema = z
	.object({
		players: z.array(
			z.object({
				id: schema.profileId,
				points: schema.points,
			}),
		),
		playersCount: z.number(),
		defaultPoints: z.number(),
		crackBoxPlayerId: schema.profileId.transform((v) =>
			v === "" ? undefined : v,
		),
	})
	.refine(
		({ players, playersCount }) => {
			return (
				players.filter(({ points }) => points !== undefined).length ===
				playersCount
			);
		},
		{
			error: (issue) => {
				const data = issue.input as { playersCount: number };
				return {
					message: `${data.playersCount}人分の点数を入力してください`,
					path: ["players"],
				};
			},
		},
	)
	.refine(
		({ players, playersCount, defaultPoints }) => {
			const total = players.reduce((acc, { points }) => {
				return acc + (points ?? 0);
			}, 0);
			return total === playersCount * defaultPoints;
		},
		{
			error: (issue) => {
				const data = issue.input as {
					players: Array<{ id: string; points?: number }>;
					playersCount: number;
					defaultPoints: number;
				};
				const total = data.players.reduce(
					(acc, { points }) => acc + (points ?? 0),
					0,
				);
				return {
					message: `点数の合計が${(
						data.playersCount * data.defaultPoints
					).toLocaleString()}点になるように入力してください\n現在: ${total.toLocaleString()}点`,
					path: ["players"],
				};
			},
		},
	)
	.refine(
		({ players, crackBoxPlayerId }) => {
			const underZeroPointsPlayerExists = players.some(
				({ points }) => typeof points === "number" && points < 0,
			);
			if (!underZeroPointsPlayerExists && crackBoxPlayerId !== undefined) {
				return false;
			}
			return true;
		},
		{
			path: ["crackBoxPlayerId"],
			message: "0点を下回るプレイヤーがいません",
		},
	);

export type AddGameInputSchema = z.input<typeof addGameSchema>;

export async function addGame(
	matchId: string,
	rule: Rule,
	totalPlayersCount: number,
	_prevState: AddGameState,
	formData: FormData,
): Promise<AddGameState> {
	const players = Array.from({ length: totalPlayersCount }).map((_, i) => {
		return {
			id: formData.get(`players.${i}.id`),
			points: formData.get(`players.${i}.points`),
		};
	});

	const validatedFields = addGameSchema.safeParse({
		players,
		playersCount: rule.playersCount,
		defaultPoints: rule.defaultPoints,
		crackBoxPlayerId: formData.get("crackBoxPlayerId"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { createGame } = await serverServices();

	const playerScores = calcPlayerScores({
		players: validatedFields.data.players.filter(
			(players) => players.points !== undefined,
		) as { id: string; points: number }[],
		rule,
		crackBoxPlayerId: validatedFields.data.crackBoxPlayerId,
	});

	await createGame({
		matchId,
		gamePlayers: playerScores,
	});

	revalidatePath(`/matches/${matchId}`);

	return {
		success: true,
	};
}
