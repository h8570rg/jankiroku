"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { serverServices } from "~/lib/services/server";
import { schema } from "~/lib/utils/schema";
import { createClient } from "~/lib/utils/supabase/server";

type State = {
  errors?: {
    base?: string[];
    name?: string[];
    janrecoId?: string[];
  };
};

const updateProfileSchema = z.object({
  name: schema.name,
  janrecoId: schema.janrecoId,
});

export async function updateProfile(
  userId: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = updateProfileSchema.safeParse({
    name: formData.get("name"),
    janrecoId: formData.get("janrecoId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, janrecoId } = validatedFields.data;

  const { getProfileExists, updateProfile } = serverServices();

  const { data: profileExists } = await getProfileExists({ janrecoId });

  if (profileExists) {
    return {
      errors: {
        janrecoId: ["このIDは既に使用されています。"],
      },
    };
  }

  await updateProfile({
    name,
    janrecoId,
    userId,
  });

  revalidatePath("/");
  redirect("/");
}

export async function signOut() {
  const supabase = createClient();

  await supabase.auth.signOut();

  /**
   * @see https://nextjs.org/docs/app/api-reference/functions/revalidatePath#revalidating-all-data
   */
  revalidatePath("/", "layout");
  redirect("/login");
}
