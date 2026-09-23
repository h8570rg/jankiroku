"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UpdateUserProfileErrorCode, updateUserProfile } from "@/lib/data/user";
import { createClient } from "@/lib/supabase/server";
import { updateProfileSchema } from "./schema";

export async function updateProfile(
  avatarUrl: string | undefined,
  _prevState: unknown,
  formData: FormData,
) {
  const submission = parseSubmission(formData);
  const result = updateProfileSchema.safeParse(submission.payload);

  if (!result.success) {
    return report(submission, {
      error: {
        issues: result.error.issues,
      },
    });
  }
  const { name, displayId } = result.data;

  const updateResult = await updateUserProfile({
    name,
    displayId,
    avatarUrl,
  });

  if (!updateResult.success) {
    if (updateResult.error.code === UpdateUserProfileErrorCode.DISPLAY_ID_TAKEN) {
      return report(submission, {
        error: {
          fieldErrors: {
            displayId: ["このIDは既に使用されています。"],
          },
        },
      });
    }
    throw new Error(`Unexpected updateUserProfile error: ${updateResult.error.code}`);
  }

  revalidatePath("/", "layout");
  redirect("/matches");
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  /**
   * @see https://nextjs.org/docs/app/api-reference/functions/revalidatePath#revalidating-all-data
   */
  revalidatePath("/", "layout");
  redirect("/login");
}
