"use server";

import { parseSubmission, report } from "@conform-to/react/future";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverServices } from "@/lib/services/server";
import { createMatchSchema } from "./schema";

export async function createMatch(_prevState: unknown, formData: FormData) {
  const submission = parseSubmission(formData);
  const payload = submission.payload;

  const inclineFormData = payload.incline;
  const getCustomIncline = (): Record<string, string> | undefined => {
    if (inclineFormData !== "custom") return undefined;
    const raw = payload.customIncline as Record<string, unknown> | undefined;
    const get = (key: string) =>
      raw?.[key] ??
      payload[`customIncline.${key}`] ??
      formData.get(`customIncline.${key}`) ??
      "";
    return {
      incline1: String(get("incline1")),
      incline2: String(get("incline2")),
      incline3: String(get("incline3")),
      incline4: String(get("incline4")),
    };
  };
  const validatedFields = createMatchSchema.safeParse({
    playersCount: payload.playersCount,
    incline: inclineFormData,
    customIncline: getCustomIncline(),
    rate: payload.rate,
    chipRate: payload.chipRate,
    crackBoxBonus: payload.crackBoxBonus,
    defaultPoints: payload.defaultPoints,
    defaultCalcPoints: payload.defaultCalcPoints,
    calcMethod: payload.calcMethod,
  });

  if (!validatedFields.success) {
    return report(submission, {
      error: { issues: validatedFields.error.issues },
    });
  }

  const { incline, customIncline, ...restData } = validatedFields.data;

  const { createMatch } = await serverServices();

  const inclineValue =
    incline === "custom" && customIncline !== undefined
      ? customIncline
      : incline;

  const { id } = await createMatch({
    incline: inclineValue,
    ...restData,
  });

  revalidatePath("/matches");
  redirect(`/matches/${id}`);
}
