import { z } from "zod";

const calcMethods = ["round", "roundOff", "roundDown", "roundUp"] as const;
export const calcMethod: Record<(typeof calcMethods)[number], string> = {
  round: "五捨六入",
  roundOff: "四捨五入",
  roundDown: "切り捨て",
  roundUp: "切り上げ",
};
export type CalcMethod = (typeof calcMethods)[number];

export const PASSWORD_MIN_LENGTH = 6;
export const NAME_MAX_LENGTH = 12;
export const JANRECO_ID_MIN_LENGTH = 4;
export const JANRECO_ID_MAX_LENGTH = 12;

export const schemas = {
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
  janrecoId: z
    .string()
    .min(1, "ユーザーIDを入力してください")
    .min(
      JANRECO_ID_MIN_LENGTH,
      `ユーザーIDは${JANRECO_ID_MIN_LENGTH}文字以上で入力してください`,
    )
    .max(
      JANRECO_ID_MAX_LENGTH,
      `ユーザーIDは${JANRECO_ID_MAX_LENGTH}文字以内で入力してください`,
    )
    .regex(/^[a-zA-Z0-9]+$/, "ユーザーIDは半角英数字のみで入力してください"),
  calcMethod: z.enum(calcMethods),
  chipRate: z
    .string()
    .min(1, "チップレートを入力してください")
    .transform(Number),
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
  playersCount: z.number(),
  points: z
    .string()
    .transform((v) => (v === "0" || !!v ? Number(v) * 100 : undefined)),
  rate: z.string().min(1, "レートを入力してください").transform(Number),
  incline: z
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
    ),
};
