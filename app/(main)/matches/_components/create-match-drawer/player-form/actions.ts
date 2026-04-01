"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverServices } from "@/lib/services/server";
import type { RuleOutput } from "../rule-form/schema";
import { playerStepSchema } from "./schema";

export async function createMatch(
  ruleData: RuleOutput,
  _prevState: unknown,
  formData: FormData,
) {
  const submission = parseSubmission(formData);
  const result = playerStepSchema.safeParse(submission.payload);

  if (!result.success) {
    return report(submission, {
      error: { issues: result.error.issues },
    });
  }

  const { playerIds } = result.data;

  const { createMatch } = await serverServices();
  const { id } = await createMatch({
    ...ruleData,
    playerIds,
  });

  revalidatePath("/matches");
  redirect(`/matches/${id}`);
}
