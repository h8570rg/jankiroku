import { expect, test } from "@playwright/test";

/**
 * ログアウトは Supabase のセッションをサーバー側で無効化するため、
 * 共有の storageState を破壊してしまう。
 * playwright.config.ts の cleanup プロジェクトで最後に実行される。
 */
test.describe("ログアウト", () => {
  test("ログアウトするとログインページにリダイレクトされ、再アクセスもできない", async ({
    page,
  }) => {
    await page.goto("/matches");
    await expect(page).toHaveURL("/matches");

    await page.getByRole("button", { name: "プロフィールメニュー" }).click();
    await page.getByRole("menuitem", { name: "ログアウト" }).click();

    await expect(page).toHaveURL(/\/login/);

    await page.goto("/matches");
    await expect(page).toHaveURL(/\/login/);
  });
});
