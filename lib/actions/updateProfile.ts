"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { serverServices } from "~/lib/services";
import { schemas } from "~/lib/utils/schemas";

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
