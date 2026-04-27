import { test as setup } from "@playwright/test";

/**
 * 新規サインアップ直後・プロフィール未登録状態のユーザーのセッションを保存する。
 * register.spec.ts のバリデーションテストで共有される。
 */
const authFile = "e2e/.auth/unregistered.json";

setup("authenticate unregistered user", async ({ page }) => {
  await page.goto("/login");

  await page
    .getByRole("textbox", { name: "メールアドレス" })
    .fill("unregistered@example.com");
  await page.getByRole("textbox", { name: "パスワード" }).fill("password123");
  await page.getByRole("button", { name: "ログイン", exact: true }).click();

  // 未登録ユーザーは /matches アクセス時にアバター表示ロジックで /register に飛ばされる
  await page.waitForURL(/\/register/);

  await page.context().storageState({ path: authFile });
});
