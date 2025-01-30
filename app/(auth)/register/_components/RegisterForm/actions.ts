"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { serverServices } from "@/lib/services/server";
import { schema } from "@/lib/utils/schema";
import { createClient } from "@/lib/utils/supabase/server";

type State = {
  errors?: {
    base?: string[];
    name?: string[];
    displayId?: string[];
  };
};

const updateProfileSchema = z.object({
  name: schema.name,
  displayId: schema.displayId,
});

export async function updateProfile(
  userId: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = updateProfileSchema.safeParse({
    name: formData.get("name"),
    displayId: formData.get("displayId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, displayId } = validatedFields.data;

  const { updateUserProfile } = await serverServices();

  const result = await updateUserProfile({
    name,
    displayId,
  });

  if (!result.success) {
    if (result.error.code === "23505") {
      return {
        errors: {
          displayId: ["このIDは既に使用されています。"],
        },
      };
    } else {
      throw result.error;
    }
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
