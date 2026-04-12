"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { serverServices } from "@/lib/services/server";
import { profileUpdateSchema } from "./schema";

export async function updateProfile(_prevState: unknown, formData: FormData) {
  const submission = parseSubmission(formData);
  const result = profileUpdateSchema.safeParse(submission.payload);

  if (!result.success) {
    return report(submission, {
      error: {
        issues: result.error.issues,
      },
    });
  }
  const { name, avatarUrl } = result.data;

  const { getUserProfile, updateUserProfile } = await serverServices();

  const profile = await getUserProfile();
  if (!profile.displayId) {
    return report(submission, {
      error: { formErrors: ["プロフィールが見つかりません。"] },
    });
  }

  const updateResult = await updateUserProfile({
    name,
    displayId: profile.displayId,
    avatarUrl,
  });

  if (!updateResult.success) {
    throw updateResult.error;
  }

  revalidatePath("/", "layout");
  return report(submission, {});
}
