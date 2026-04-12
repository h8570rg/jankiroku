"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { serverServices } from "@/lib/services/server";
import type { Profile } from "@/lib/type";
import { updatePlayersSchema } from "./schema";

export async function updateMatchPlayers(
  matchId: string,
  existingPlayerIds: string[],
  _prevState: unknown,
  formData: FormData,
) {
  const submission = parseSubmission(formData);
  const result = updatePlayersSchema.safeParse({
    playerIds: Array.isArray(submission.payload.playerIds)
      ? submission.payload.playerIds
      : [submission.payload.playerIds],
  });

  if (!result.success) {
    return report(submission, {
      error: { issues: result.error.issues },
    });
  }

  const { playerIds } = result.data;
  const newPlayerIds = playerIds.filter(
    (id) => !existingPlayerIds.includes(id),
  );

  if (newPlayerIds.length > 0) {
    const { addMatchPlayers } = await serverServices();
    await addMatchPlayers({
      matchId,
      playerIds: newPlayerIds,
      startOrder: existingPlayerIds.length,
    });
    revalidatePath(`/matches/${matchId}`);
  }

  return report(submission, {});
}

export async function searchProfiles(text: string): Promise<Profile[]> {
  if (!text) {
    return [];
  }

  const { searchProfiles } = await serverServices();
  const profiles = await searchProfiles({ text });
  return profiles;
}
