import { z } from "zod";
import {
  calcMethods,
  chipRatePresets,
  chipRatePresetValue,
  DISPLAY_ID_MAX_LENGTH,
  DISPLAY_ID_MIN_LENGTH,
  inclinesPresetsFor3Players,
  inclinesPresetsFor4Players,
  NAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/lib/config";

export const schema = {
  email: z
    .string("メールアドレスを入力してください")
    .pipe(z.email("メールアドレスを正しい形式で入力してください")),
  password: z
    .string("パスワードを入力してください")
    .min(
      PASSWORD_MIN_LENGTH,
      `パスワードは${PASSWORD_MIN_LENGTH}文字以上で入力してください`,
    ),
  name: z
    .string("名前を入力してください")
    .max(NAME_MAX_LENGTH, `名前は${NAME_MAX_LENGTH}文字以内で入力してください`),
  displayId: z
    .string("ユーザーIDを入力してください")
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
  chipRate: z
    .object({
      preset: z.enum(chipRatePresets),
      custom: z.string().optional(),
    })
    .superRefine(({ preset, custom }, ctx) => {
      if (preset !== "custom") {
        return;
      }
      if (custom === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "チップレートを入力してください",
          path: [],
        });
        return;
      }
      if (Number(custom) < 0) {
        ctx.addIssue({
          code: "custom",
          message: "チップレートは0以上で入力してください",
          path: [],
        });
      }
    })
    .transform(({ preset, custom }) => {
      if (preset !== "custom" || custom === undefined) {
        // biome-ignore lint/style/noNonNullAssertion: preset is not undefined
        return chipRatePresetValue[preset]!;
      }
      return Number(custom);
    }),
  crackBoxBonus: z.string("飛び賞を入力してください").transform(Number),
  defaultCalcPoints: z.string("オカを入力してください").transform(Number),
  defaultPoints: z.string("持ち点を入力してください").transform(Number),
  matchId: z.string(),
  profileId: z.string(),
  playersCount: z.union([z.literal("4"), z.literal("3")]).transform(Number),
  points: z
    .string()
    .transform((v) => (v === "0" || !!v ? Number(v) * 100 : undefined)),
  rate: z.string().transform(Number),
  inclineFor4Players: z
    .object({
      presets: z.enum(inclinesPresetsFor4Players),
      custom: z
        .object({
          incline1: z.coerce.number().optional(),
          incline2: z.coerce.number().optional(),
          incline3: z.coerce.number().optional(),
          incline4: z.coerce.number().optional(),
        })
        .optional(),
    })
    .superRefine(({ presets, custom }, ctx) => {
      if (presets !== "custom") {
        return;
      }
      if (
        custom?.incline1 === undefined ||
        custom?.incline2 === undefined ||
        custom?.incline3 === undefined ||
        custom?.incline4 === undefined
      ) {
        ctx.addIssue({
          code: "custom",
          message: "ウマを入力してください",
          path: [],
        });
        return;
      }
      const sum = [
        custom.incline1,
        custom.incline2,
        custom.incline3,
        custom.incline4,
      ].reduce((acc, incline) => acc + incline, 0);
      if (sum !== 0) {
        ctx.addIssue({
          code: "custom",
          message: "ウマの合計が0になるように入力してください",
          path: [],
        });
      }
    })
    .transform(({ presets, custom }) => {
      if (presets !== "custom" || !custom) {
        return presets;
      }
      return `${custom.incline1}_${custom.incline2}_${custom.incline3}_${custom.incline4}`;
    }),
  inclineFor3Players: z
    .object({
      presets: z.enum(inclinesPresetsFor3Players),
      custom: z
        .object({
          incline1: z.coerce.number().optional(),
          incline2: z.coerce.number().optional(),
          incline3: z.coerce.number().optional(),
        })
        .optional(),
    })
    .superRefine(({ presets, custom }, ctx) => {
      if (presets !== "custom") {
        return;
      }
      if (
        custom?.incline1 === undefined ||
        custom?.incline2 === undefined ||
        custom?.incline3 === undefined
      ) {
        ctx.addIssue({
          code: "custom",
          message: "ウマを入力してください",
          path: [],
        });
        return;
      }
      const sum = [custom.incline1, custom.incline2, custom.incline3].reduce(
        (acc, incline) => acc + incline,
        0,
      );
      if (sum !== 0) {
        ctx.addIssue({
          code: "custom",
          message: "ウマの合計が0になるように入力してください",
          path: [],
        });
      }
    })
    .transform(({ presets, custom }) => {
      if (presets !== "custom" || !custom) {
        return presets;
      }
      return `${custom.incline1}_${custom.incline2}_${custom.incline3}_0`;
    }),
};
