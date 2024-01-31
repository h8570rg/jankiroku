"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { serverServices } from "~/lib/services/server";
import { schemas } from "~/lib/utils/schemas";

type State = {
  errors?: {
    base?: string[];
    playersCount?: string[];
    incline?: string[];
    rate?: string[];
    chipRate?: string[];
    crackBoxBonus?: string[];
    defaultPoints?: string[];
    defaultCalcPoints?: string[];
    calcMethod?: string[];
  };
};

const schema = z.object({
  playersCount: schemas.playersCount,
  incline: schemas.incline,
  rate: schemas.rate,
  chipRate: schemas.chipRate,
  crackBoxBonus: schemas.crackBoxBonus,
  defaultPoints: schemas.defaultPoints,
  defaultCalcPoints: schemas.defaultCalcPoints,
  calcMethod: schemas.calcMethod,
});

export type InputSchema = z.input<typeof schema>;

export async function createMatch(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = schema.safeParse({
    playersCount: formData.get("playersCount"),
    incline: {
      incline1: formData.get("incline.incline1"),
      incline2: formData.get("incline.incline2"),
      incline3: formData.get("incline.incline3"),
      incline4: formData.get("incline.incline4"),
    },
    rate: formData.get("rate"),
    chipRate: formData.get("chipRate"),
    crackBoxBonus: formData.get("crackBoxBonus"),
    defaultPoints: formData.get("defaultPoints"),
    defaultCalcPoints: formData.get("defaultCalcPoints"),
    calcMethod: formData.get("calcMethod"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    playersCount,
    incline: { incline1, incline2, incline3, incline4 },
    rate,
    chipRate,
    crackBoxBonus,
    defaultPoints,
    defaultCalcPoints,
    calcMethod,
  } = validatedFields.data;

  const { createMatch } = serverServices();

  const { id } = await createMatch({
    playersCount,
    incline: { incline1, incline2, incline3, incline4 },
    rate,
    chipRate,
    crackBoxBonus,
    defaultPoints,
    defaultCalcPoints,
    calcMethod,
  });

  revalidatePath("/matches");
  redirect(`/matches/${id}`);
}
