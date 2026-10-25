import { test as setup } from "@playwright/test";
import { loginWithOtp } from "./helpers";

/**
 * 新規サインアップ直後・プロフィール未登録状態のユーザーのセッションを保存する。
 * register.spec.ts のバリデーションテストで共有される。
 */
const authFile = "e2e/.auth/unregistered.json";

setup("authenticate unregistered user", async ({ page }) => {
  await loginWithOtp(page, "unregistered@example.com");

  // 未登録ユーザーはログイン後 /register に飛ばされる
  await page.waitForURL(/\/register/);

  await page.context().storageState({ path: authFile });
});
