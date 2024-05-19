"use server";

import { z } from "zod";
import { serverServices } from "@/lib/services/server";

export async function addUserPlayer({
  matchId,
  playerId,
}: {
  matchId: string;
  playerId: string;
}) {
  const { addMatchPlayer } = serverServices();
  await addMatchPlayer({
    matchId,
    playerId,
  });
}

type SearchProfilesState = {
  profiles?: Awaited<
    ReturnType<ReturnType<typeof serverServices>["searchProfiles"]>
  >;
  errors?: {
    text?: string[];
  };
};

const searchProfilesSchema = z.object({
  text: z.string(),
});

export async function searchProfiles(
  prevState: SearchProfilesState,
  formDate: FormData,
): Promise<SearchProfilesState> {
  const validatedFields = searchProfilesSchema.safeParse({
    text: formDate.get("text"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { text } = validatedFields.data;

  if (!text) {
    return {};
  }

  const { searchProfiles } = serverServices();
  const profiles = await searchProfiles({ text });
  return {
    profiles,
  };
}
