"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { serverServices } from "@/lib/services/server";
import { addChipSchema } from "./schema";

function ensurePlayerChipArray(
  payload: Record<string, unknown>,
): { profileId: string; chipCount: string }[] {
  const raw = payload.playerChip;
  if (Array.isArray(raw)) {
    return raw.map((item) => ({
      profileId: String((item as Record<string, unknown>)?.profileId ?? ""),
      chipCount: String((item as Record<string, unknown>)?.chipCount ?? ""),
    }));
  }
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return Object.keys(raw)
      .sort((a, b) => Number(a) - Number(b))
      .map((i) => {
        const item = (raw as Record<string, unknown>)[i] as Record<
          string,
          unknown
        >;
        return {
          profileId: String(item?.profileId ?? ""),
          chipCount: String(item?.chipCount ?? ""),
        };
      });
  }
  return [];
}

export async function addChip(_prevState: unknown, formData: FormData) {
  const submission = parseSubmission(formData);
  const matchId = submission.payload.matchId;
  if (typeof matchId !== "string") {
    return report(submission, {
      error: { formErrors: ["無効なリクエストです。"] },
    });
  }

  const playerChip = ensurePlayerChipArray(submission.payload);
  const result = addChipSchema.safeParse({ playerChip });

  if (!result.success) {
    return report(submission, {
      error: { issues: result.error.issues },
    });
  }

  const { updateMatchPlayer } = await serverServices();

  await Promise.all(
    result.data.playerChip.map((row) =>
      updateMatchPlayer({
        matchId,
        playerId: row.profileId,
        chipCount: row.chipCount,
      }),
    ),
  );

  revalidatePath(`/matches/${matchId}`);

  return report(submission, {});
}
