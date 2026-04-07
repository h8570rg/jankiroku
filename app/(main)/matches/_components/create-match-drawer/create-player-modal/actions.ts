"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { serverServices } from "@/lib/services/server";
import { createPlayerSchema } from "./schema";

export async function createPlayer(_prevState: unknown, formData: FormData) {
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

  return report(submission, {
    value: { data: JSON.stringify(profile) },
  });
}
