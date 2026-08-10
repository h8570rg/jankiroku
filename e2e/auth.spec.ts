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

  test("誤ったパスワードではログインできない", async ({ page }) => {
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

  test("未登録のメールアドレスではログインできない", async ({ page }) => {
    await page.goto("/login");

    await page
      .getByRole("textbox", { name: "メールアドレス" })
      .fill("nobody@example.com");
    await page.getByRole("textbox", { name: "パスワード" }).fill("password123");
    await page.getByRole("button", { name: "ログイン", exact: true }).click();

    await expect(
      page.getByText("メールアドレスまたはパスワードが間違っています"),
    ).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("メールアドレス未入力ではバリデーションエラー", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("textbox", { name: "パスワード" }).fill("password123");
    await page.getByRole("button", { name: "ログイン", exact: true }).click();

    await expect(
      page.getByText("メールアドレスを入力してください"),
    ).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("メールアドレス形式が不正ならバリデーションエラー", async ({ page }) => {
    await page.goto("/login");

    await page
      .getByRole("textbox", { name: "メールアドレス" })
      .fill("not-an-email");
    await page.getByRole("textbox", { name: "パスワード" }).fill("password123");
    await page.getByRole("button", { name: "ログイン", exact: true }).click();

    await expect(
      page.getByText("メールアドレスを正しい形式で入力してください"),
    ).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("パスワード未入力ではバリデーションエラー", async ({ page }) => {
    await page.goto("/login");

    await page
      .getByRole("textbox", { name: "メールアドレス" })
      .fill("test@example.com");
    await page.getByRole("button", { name: "ログイン", exact: true }).click();

    await expect(page.getByText("パスワードを入力してください")).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("パスワードが短いとバリデーションエラー", async ({ page }) => {
    await page.goto("/login");

    await page
      .getByRole("textbox", { name: "メールアドレス" })
      .fill("test@example.com");
    await page.getByRole("textbox", { name: "パスワード" }).fill("12345");
    await page.getByRole("button", { name: "ログイン", exact: true }).click();

    await expect(
      page.getByText("パスワードは6文字以上で入力してください"),
    ).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("未認証ユーザーは各保護ページにアクセスするとログインページにリダイレクトされる", async ({
    page,
  }) => {
    for (const path of ["/matches", "/friends", "/profile"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test("ログインページに新規登録ページへのリンクが存在する", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page.getByRole("link", { name: "新規登録" })).toBeVisible();
  });
});
