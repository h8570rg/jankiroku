import { z } from "zod";

export const schemas = {
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("メールアドレスを正しい形式で入力してください"),
  password: z
    .string()
    .min(1, "パスワードを入力してください")
    .min(6, "パスワードは6文字以上で入力してください"),
};
