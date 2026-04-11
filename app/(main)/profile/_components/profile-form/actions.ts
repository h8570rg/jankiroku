"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { serverServices } from "@/lib/services/server";
import { updateNameSchema } from "./schema";

export async function updateName(_prevState: unknown, formData: FormData) {
  const submission = parseSubmission(formData);
  const result = updateNameSchema.safeParse(submission.payload);

  if (!result.success) {
    return report(submission, {
      error: {
        issues: result.error.issues,
      },
    });
  }
  const { name } = result.data;

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
  });

  if (!updateResult.success) {
    throw updateResult.error;
  }

  revalidatePath("/", "layout");
  return report(submission, {});
}
