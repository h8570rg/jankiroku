"use server";

import { revalidatePath } from "next/cache";
import { serverServices } from "@/lib/services/server";

export async function deleteGame({
	gameId,
	matchId,
}: {
	gameId: string;
	matchId: string;
}) {
	const { deleteGame } = await serverServices();
	await deleteGame({ gameId });

	revalidatePath(`/matches/${matchId}`);
}
