"use server";

import { z } from "zod";
import { serverServices } from "@/lib/services/server";
import { schema } from "@/lib/utils/schema";

type State = {
  success?: boolean;
  errors?: {
    base?: string[];
    name?: string[];
  };
};

const addAnonymousPlayerSchema = z.object({
  name: schema.name,
});

export async function addAnonymousPlayer(
  matchId: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = addAnonymousPlayerSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { createProfile, addMatchPlayer } = serverServices();
  const player = await createProfile({
    ...validatedFields.data,
  });

  await addMatchPlayer({
    matchId,
    playerId: player.id,
  });

  return {
    success: true,
  };
}
