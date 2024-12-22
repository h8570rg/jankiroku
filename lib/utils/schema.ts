import { z } from "zod";
import {
  DISPLAY_ID_MAX_LENGTH,
  DISPLAY_ID_MIN_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  calcMethods,
  chipRates,
  inclines,
  rates,
} from "@/lib/config";

export const schema = {
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("メールアドレスを正しい形式で入力してください"),
  password: z
    .string()
    .min(1, "パスワードを入力してください")
    .min(
      PASSWORD_MIN_LENGTH,
      `パスワードは${PASSWORD_MIN_LENGTH}文字以上で入力してください`,
    ),
  name: z
    .string()
    .min(1, "名前を入力してください")
    .max(NAME_MAX_LENGTH, `名前は${NAME_MAX_LENGTH}文字以内で入力してください`),
  displayId: z
    .string()
    .min(1, "ユーザーIDを入力してください")
    .min(
      DISPLAY_ID_MIN_LENGTH,
      `ユーザーIDは${DISPLAY_ID_MIN_LENGTH}文字以上で入力してください`,
    )
    .max(
      DISPLAY_ID_MAX_LENGTH,
      `ユーザーIDは${DISPLAY_ID_MAX_LENGTH}文字以内で入力してください`,
    )
    .regex(/^[a-zA-Z0-9]+$/, "ユーザーIDは半角英数字のみで入力してください"),
  calcMethod: z.enum(calcMethods),
  chipRate: z.string().transform((v) => chipRates[Number(v)]),
  crackBoxBonus: z
    .string()
    .min(1, "飛び賞を入力してください")
    .transform(Number),
  defaultCalcPoints: z
    .string()
    .min(1, "オカを入力してください")
    .transform(Number),
  defaultPoints: z
    .string()
    .min(1, "持ち点を入力してください")
    .transform(Number),
  matchId: z.string(),
  profileId: z.string(),
  playersCount: z.union([z.literal("4"), z.literal("3")]).transform(Number),
  points: z
    .string()
    .transform((v) => (v === "0" || !!v ? Number(v) * 100 : undefined)),
  rate: z.string().transform((v) => rates[Number(v)]),
  incline: z.enum(inclines),
  customIncline: z
    .object({
      incline1: z.string().min(1, "ウマを入力してください").transform(Number),
      incline2: z.string().min(1, "ウマを入力してください").transform(Number),
      incline3: z.string().min(1, "ウマを入力してください").transform(Number),
      incline4: z.string().min(1, "ウマを入力してください").transform(Number),
    })
    .refine(
      ({ incline1, incline2, incline3, incline4 }) => {
        const sum = incline1 + incline2 + incline3 + incline4;
        return sum === 0;
      },
      {
        path: ["root"],
        message: "ウマの合計が0になるように入力してください",
      },
    )
    .transform(({ incline1, incline2, incline3, incline4 }) => {
      return `${incline1}_${incline2}_${incline3}_${incline4}`;
    }),
};
