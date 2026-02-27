"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { serverServices } from "@/lib/services/server";
import { createProfileSchema } from "./schema";

export async function createProfile(_prevState: unknown, formData: FormData) {
  const submission = parseSubmission(formData);
  const result = createProfileSchema.safeParse(submission.payload);

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
