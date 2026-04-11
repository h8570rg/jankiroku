"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverServices } from "@/lib/services/server";
import { createClient } from "@/lib/supabase/server";
import { updateProfileSchema } from "./schema";

export async function updateProfile(_prevState: unknown, formData: FormData) {
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

  const userId = submission.payload.userId;
  if (typeof userId !== "string") {
    return report(submission, {
      error: { formErrors: ["無効なリクエストです。"] },
    });
  }

  const { updateUserProfile } = await serverServices();

  const updateResult = await updateUserProfile({
    name,
    displayId,
  });

  if (!updateResult.success) {
    if (updateResult.error.code === "23505") {
      return report(submission, {
        error: {
          fieldErrors: {
            displayId: ["このIDは既に使用されています。"],
          },
        },
      });
    }
    throw updateResult.error;
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
