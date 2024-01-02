"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { schemas } from "~/lib/utils/schemas";
import { createSupabaseServerClient } from "~/lib/utils/supabase/serverClient";

type State = {
  errors?: {
    base?: string[];
    email?: string[];
    password?: string[];
  };
};

const schema = z.object({
  email: schemas.email,
  password: schemas.password,
});

export async function signUp(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
      errors: {
        email: ["このメールアドレスは使用できません。"],
      },
    };
  }

  /**
   * @see https://nextjs.org/docs/app/api-reference/functions/revalidatePath#revalidating-all-data
   */
  revalidatePath("/", "layout");
  redirect("/");
}
