"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverServices } from "@/lib/services/server";
import { createMatchSchema } from "./schema";

export async function createMatch(_prevState: unknown, formData: FormData) {
  const submission = parseSubmission(formData);
  const result = createMatchSchema.safeParse(submission.payload);

  if (!result.success) {
    return report(submission, {
      error: { issues: result.error.issues },
    });
  }

  const {
    playersCount,
    incline,
    rate,
    chipRate,
    crackBoxBonus,
    defaultPoints,
    defaultCalcPoints,
    calcMethod,
    playerIds,
  } = result.data;

  const { createMatch } = await serverServices();
  const { id } = await createMatch({
    playersCount,
    incline,
    rate,
    chipRate,
    crackBoxBonus,
    defaultPoints,
    defaultCalcPoints,
    calcMethod,
    playerIds,
  });

  revalidatePath("/matches");
  redirect(`/matches/${id}`);
}
