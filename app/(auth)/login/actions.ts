"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { schemas } from "~/lib/utils/schemas";
import { createClient } from "~/lib/utils/supabase/server";

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

/**
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function signInEmail(
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

  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      errors: {
        base: ["メールアドレスまたはパスワードが間違っています。"],
      },
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
