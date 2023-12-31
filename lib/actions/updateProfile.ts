"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { schemas } from "~/lib/utils/schemas";
import { createSupabaseServerComponentClient } from "~/lib/utils/supabase/serverComponentClient";

type State = {
  errors?: {
    base?: string[];
    id?: string[];
    name?: string[];
    janrecoId?: string[];
  };
};

const schema = z.object({
  id: schemas.uid,
  name: schemas.name,
  janrecoId: schemas.janrecoId,
});

export async function updateProfile(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    janrecoId: formData.get("janrecoId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, name, janrecoId } = validatedFields.data;

  const supabase = createSupabaseServerComponentClient();

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
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/");
  redirect("/");
}
