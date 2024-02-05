import { z } from "zod";

export const rate: Record<string, { value: string; label: string }> = {
  "0": {
    value: "0",
    label: "なし",
  },
  "1": {
    value: "1",
    label: "1 (テンイチ)",
  },
  "2": {
    value: "2",
    label: "2 (テンニ)",
  },
  "3": {
    value: "3",
    label: "3 (テンサン)",
  },
  "4": {
    value: "5",
    label: "5 (テンゴ)",
  },
  "5": {
    value: "10",
    label: "10 (テンピン)",
  },
  "6": {
    value: "20",
    label: "20 (テンリャンピン)",
  },
  "7": {
    value: "50",
    label: "50 (ウーピン)",
  },
  "8": {
    value: "100",
    label: "100 (デカピン)",
  },
};

export const chipRate: Record<string, { value: string; label: string }> = {
  "0": {
    value: "0",
    label: "なし",
  },
  "1": {
    value: "50",
    label: "50円",
  },
  "2": {
    value: "100",
    label: "100円",
  },
  "3": {
    value: "200",
    label: "200円",
  },
  "4": {
    value: "500",
    label: "500円",
  },
  "5": {
    value: "1000",
    label: "1000円",
  },
};

const calcMethods = ["round", "roundOff", "roundDown", "roundUp"] as const;
export const calcMethod: Record<(typeof calcMethods)[number], string> = {
  round: "五捨六入",
  roundOff: "四捨五入",
  roundDown: "切り捨て",
  roundUp: "切り上げ",
};
export type CalcMethod = (typeof calcMethods)[number];

const inclinesFor4Players = [
  "custom",
  "0_0_0_0",
  "10_5_-5_-10",
  "20_10_-10_-20",
  "30_10_-10_-30",
] as const;
const inclinesFor3Players = [
  "custom",
  "0_0_0_0",
  "10_0_-10_0",
  "20_0_-20_0",
  "30_0_-30_0",
] as const;
const inclines = [...inclinesFor4Players, ...inclinesFor3Players] as const;
export const inclineFor4Players: Record<
  (typeof inclinesFor4Players)[number],
  string
> = {
  "0_0_0_0": "なし",
  "10_5_-5_-10": "+10, +5, -5, -10 (ゴットー)",
  "20_10_-10_-20": "+20, +10, -10, -20 (ワンツー)",
  "30_10_-10_-30": "+30, +10, -10, -30 (ワンスリー)",
  custom: "カスタム",
};
export const inclineFor3Players: Record<
  (typeof inclinesFor3Players)[number],
  string
> = {
  "0_0_0_0": "なし",
  "10_0_-10_0": "+10, 0, -10 (順位ウマ10)",
  "20_0_-20_0": "+20, 0, -20 (順位ウマ20)",
  "30_0_-30_0": "+30, 0, -30 (順位ウマ30)",
  custom: "カスタム",
};

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
  chipRate: z.string().transform((v) => Number(chipRate[v].value)),
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
  rate: z.string().transform((v) => Number(rate[v].value)),
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
