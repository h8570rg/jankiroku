"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { serverServices } from "~/lib/services/server";
import { schema } from "~/lib/utils/schema";

// TODO: actionごとにファイル切ったほうがいいかも
type AddAnonymousPlayerState = {
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
  prevState: AddAnonymousPlayerState,
  formData: FormData,
): Promise<AddAnonymousPlayerState> {
  const validatedFields = addAnonymousPlayerSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { createProfile, addMatchPlayer } = serverServices();
  const profile = await createProfile({
    ...validatedFields.data,
  });

  await addMatchPlayer({
    matchId,
    profileId: profile.id,
  });

  revalidateTag(`match-${matchId}`);

  return {
    success: true,
  };
}

export async function addUserPlayer({
  matchId,
  profileId,
}: {
  matchId: string;
  profileId: string;
}) {
  const { addMatchPlayer } = serverServices();
  await addMatchPlayer({
    matchId,
    profileId,
  });

  revalidateTag(`match-${matchId}`);
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
