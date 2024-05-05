"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { serverServices } from "~/lib/services/server";
import { schema } from "~/lib/utils/schema";

type AddChipState = {
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
  .refine(
    ({ playerChip }) => {
      const total = playerChip.reduce((acc, { chipCount }) => {
        return acc + (chipCount ?? 0);
      }, 0);
      return total === 0;
    },
    ({ playerChip }) => {
      const total = playerChip.reduce((acc, { chipCount }) => {
        return acc + (chipCount ?? 0);
      }, 0);
      return {
        path: ["playerChip"],
        message: `チップの合計が0枚なるように入力してください\n現在: ${total.toLocaleString()}枚`,
      };
    },
  );

export async function addChip(
  matchId: string,
  totalPlayersCount: number,
  prevState: AddChipState,
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
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { addMatchChip } = serverServices();

  await addMatchChip({
    matchId,
    playerChips: validatedFields.data.playerChip.map((playerChip) => {
      return {
        profileId: playerChip.profileId,
        chipCount: playerChip.chipCount,
      };
    }),
  });

  revalidateTag(`match-${matchId}-chip`);

  return {
    success: true,
  };
}
