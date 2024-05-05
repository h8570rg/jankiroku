"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { serverServices } from "~/lib/services/server";
import { schema } from "~/lib/utils/schema";

type State = {
  errors?: {
    base?: string[];
    playersCount?: string[];
    incline?: string[];
    customIncline?: string[];
    rate?: string[];
    chipRate?: string[];
    crackBoxBonus?: string[];
    defaultPoints?: string[];
    defaultCalcPoints?: string[];
    calcMethod?: string[];
  };
};

const createMatchschema = z.object({
  playersCount: schema.playersCount,
  incline: schema.incline,
  customIncline: schema.customIncline,
  rate: schema.rate,
  chipRate: schema.chipRate,
  crackBoxBonus: schema.crackBoxBonus,
  defaultPoints: schema.defaultPoints,
  defaultCalcPoints: schema.defaultCalcPoints,
  calcMethod: schema.calcMethod,
});

export type InputSchema = z.input<typeof createMatchschema>;

export async function createMatch(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const inclineFormData = formData.get("incline");
  const validatedFields = createMatchschema.safeParse({
    playersCount: formData.get("playersCount"),
    incline: inclineFormData,
    customIncline:
      inclineFormData === "custom"
        ? {
            incline1: formData.get("customIncline.incline1"),
            incline2: formData.get("customIncline.incline2"),
            incline3: formData.get("customIncline.incline3"),
            incline4: formData.get("customIncline.incline4"),
          }
        : {
            incline1: "0", // validationを通すためにダミーの値を入れる。実際には使われない。
            incline2: "0",
            incline3: "0",
            incline4: "0",
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

  const { incline, customIncline, ...restData } = validatedFields.data;

  const { createMatch } = serverServices();

  const { id } = await createMatch({
    incline: incline === "custom" ? customIncline : incline,
    ...restData,
  });

  revalidatePath("/matches");
  redirect(`/matches/${id}`);
}
