"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { serverServices } from "@/lib/services/server";
import type { Profile } from "@/lib/type";
import { createProfileSchema } from "./schema";

export type CreateProfileResult = ReturnType<typeof report> & {
  profile?: Profile;
};

export async function createProfile(
  _prevState: unknown,
  formData: FormData,
): Promise<CreateProfileResult> {
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

  return { ...report(submission, {}), profile };
}
