import { expect, test } from "@playwright/test";

test.describe("ログイン", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("正しい認証情報でログインできる", async ({ page }) => {
    await page.goto("/login");

    await page
      .getByRole("textbox", { name: "メールアドレス" })
      .fill("test@example.com");
    await page.getByRole("textbox", { name: "パスワード" }).fill("password123");
    await page.getByRole("button", { name: "ログイン", exact: true }).click();

    await expect(page).toHaveURL("/matches");
  });

  test("誤った認証情報ではログインできない", async ({ page }) => {
    await page.goto("/login");

    await page
      .getByRole("textbox", { name: "メールアドレス" })
      .fill("test@example.com");
    await page
      .getByRole("textbox", { name: "パスワード" })
      .fill("wrongpassword");
    await page.getByRole("button", { name: "ログイン", exact: true }).click();

    await expect(
      page.getByText("メールアドレスまたはパスワードが間違っています"),
    ).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("未認証ユーザーはログインページにリダイレクトされる", async ({
    page,
  }) => {
    await page.goto("/matches");

    await expect(page).toHaveURL(/\/login/);
  });
});

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
