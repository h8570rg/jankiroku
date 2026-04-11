"use server";

import {
  parseSubmission,
  report,
  type SubmissionResult,
} from "@conform-to/react/future";
import { serverServices } from "@/lib/services/server";
import type { Profile } from "@/lib/type";
import { createPlayerSchema } from "./schema";

export type CreatePlayerResult = SubmissionResult & {
  profile?: Profile;
};

export async function createPlayer(
  _prevState: unknown,
  formData: FormData,
): Promise<CreatePlayerResult> {
  const submission = parseSubmission(formData);
  const result = createPlayerSchema.safeParse(submission.payload);

  if (!result.success) {
    return report(submission, {
      error: {
        issues: result.error.issues,
      },
    });
  }
  const { name } = result.data;

  const { createProfile: createProfileService } = await serverServices();
  const profile = await createProfileService({
    name,
  });

  return { ...report(submission, {}), profile };
}
