import { z } from "zod";

const calcMethods = ["round", "roundOff", "roundDown", "roundUp"] as const;
export const calcMethod: Record<(typeof calcMethods)[number], string> = {
  [calcMethods[0]]: "五捨六入",
  [calcMethods[1]]: "四捨五入",
  [calcMethods[2]]: "切り捨て",
  [calcMethods[3]]: "切り上げ",
};

export const schemas = {
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("メールアドレスを正しい形式で入力してください"),
  password: z
    .string()
    .min(1, "パスワードを入力してください")
    .min(6, "パスワードは6文字以上で入力してください"),
  name: z
    .string()
    .min(1, "名前を入力してください")
    .max(12, "名前は12文字以内で入力してください"),
  janrecoId: z
    .string()
    .min(1, "ユーザーIDを入力してください")
    .min(4, "ユーザーIDは4文字以上で入力してください")
    .max(12, "ユーザーIDは12文字以内で入力してください")
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
  playersCount: z.number(),
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
