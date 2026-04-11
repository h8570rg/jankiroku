"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signUpSchema } from "./schema";

/**
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function signUp(_prevState: unknown, formData: FormData) {
  const submission = parseSubmission(formData);
  const result = signUpSchema.safeParse(submission.payload);

  if (!result.success) {
    return report(submission, {
      error: {
        issues: result.error.issues,
      },
    });
  }
  const { email, password } = result.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return report(submission, {
      error: {
        formErrors: ["このメールアドレスは使用できません。"],
      },
    });
  }

  revalidatePath("/", "layout");
  redirect("/register");
}
