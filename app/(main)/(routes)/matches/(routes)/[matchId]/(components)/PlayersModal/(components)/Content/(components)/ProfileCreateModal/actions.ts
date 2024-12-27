"use server";

import { z } from "zod";
import { serverServices } from "@/lib/services/server";
import { Profile } from "@/lib/type";
import { schema } from "@/lib/utils/schema";

export type State = {
  errors?: {
    name?: string[];
  };
  data?: Profile;
};

const createProfileSchema = z.object({
  name: schema.name,
});

export async function createProfile(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = createProfileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name } = validatedFields.data;

  const { createProfile } = await serverServices();
  const profile = await createProfile({
    name,
  });

  return {
    data: profile,
  };
}
