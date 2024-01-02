"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { schemas } from "~/lib/utils/schemas";
import { createSupabaseServerClient } from "~/lib/utils/supabase/serverClient";

type State = {
  errors?: {
    base?: string[];
    name?: string[];
    janrecoId?: string[];
  };
};

const schema = z.object({
  name: schemas.name,
  janrecoId: schemas.janrecoId,
});

export async function updateProfile(
  userId: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
    janrecoId: formData.get("janrecoId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, janrecoId } = validatedFields.data;

  const supabase = createSupabaseServerClient();

  const existingProfilesResult = await supabase
    .from("profiles")
    .select()
    .eq("janreco_id", janrecoId);

  if (existingProfilesResult.error) {
    throw existingProfilesResult.error;
  }

  if (existingProfilesResult.data.length > 0) {
    return {
      errors: {
        janrecoId: ["このIDは既に使用されています。"],
      },
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ name, janreco_id: janrecoId })
    .eq("id", userId);

  if (error) {
    throw error;
  }

  revalidatePath("/");
  redirect("/");
}
