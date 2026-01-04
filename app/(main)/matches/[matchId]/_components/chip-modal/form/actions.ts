"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { serverServices } from "@/lib/services/server";
import { schema } from "@/lib/utils/schema";

export type AddChipState = {
  success?: boolean;
  errors?: {
    base?: string[];
    playerChip?: string[];
  };
};

const addChipSchema = z
  .object({
    playerChip: z.array(
      z.object({
        profileId: schema.profileId,
        chipCount: z.string().transform(Number),
      }),
    ),
  })
  .superRefine(({ playerChip }, ctx) => {
    const total = playerChip.reduce((acc, { chipCount }) => {
      return acc + (chipCount ?? 0);
    }, 0);
    if (total !== 0) {
      ctx.addIssue({
        code: "custom",
        message: `チップの合計が0枚なるように入力してください\n現在: ${total.toLocaleString()}枚`,
        path: ["playerChip"],
      });
    }
  });

export async function addChip(
  matchId: string,
  totalPlayersCount: number,
  _prevState: AddChipState,
  formData: FormData,
): Promise<AddChipState> {
  const playerChip = Array.from({ length: totalPlayersCount }).map((_, i) => {
    return {
      profileId: formData.get(`playerChip.${i}.profileId`),
      chipCount: formData.get(`playerChip.${i}.chipCount`),
    };
  });

  const validatedFields = addChipSchema.safeParse({
    playerChip,
  });

  if (!validatedFields.success) {
    const flattened = z.flattenError(validatedFields.error);
    return {
      errors: flattened.fieldErrors,
    };
  }

  const { updateMatchPlayer } = await serverServices();

  await Promise.all(
    validatedFields.data.playerChip.map((playerChip) =>
      updateMatchPlayer({
        matchId,
        playerId: playerChip.profileId,
        chipCount: playerChip.chipCount,
      }),
    ),
  );

  revalidatePath(`/matches/${matchId}`);

  return {
    success: true,
  };
}
