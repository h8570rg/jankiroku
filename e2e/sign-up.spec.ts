import { expect, test } from "@playwright/test";
import { randomEmail } from "./helpers";

test.describe("新規登録", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("正しい情報で新規登録すると、登録ページへリダイレクトされる", async ({
    page,
  }) => {
    await page.goto("/sign-up");

    await page
      .getByRole("textbox", { name: "メールアドレス" })
      .fill(randomEmail());
    await page.getByRole("textbox", { name: "パスワード" }).fill("password123");
    await page.getByRole("button", { name: "新規登録", exact: true }).click();

    await expect(page).toHaveURL(/\/register/);
  });

  test("すでに使用されているメールアドレスでは登録できない", async ({
    page,
  }) => {
    await page.goto("/sign-up");

    await page
      .getByRole("textbox", { name: "メールアドレス" })
      .fill("test@example.com");
    await page.getByRole("textbox", { name: "パスワード" }).fill("password123");
    await page.getByRole("button", { name: "新規登録", exact: true }).click();

    await expect(
      page.getByText("このメールアドレスは使用できません"),
    ).toBeVisible();
    await expect(page).toHaveURL("/sign-up");
  });

  test("メールアドレス形式が不正ならバリデーションエラー", async ({ page }) => {
    await page.goto("/sign-up");

    await page
      .getByRole("textbox", { name: "メールアドレス" })
      .fill("not-an-email");
    await page.getByRole("textbox", { name: "パスワード" }).fill("password123");
    await page.getByRole("button", { name: "新規登録", exact: true }).click();

    await expect(
      page.getByText("メールアドレスを正しい形式で入力してください"),
    ).toBeVisible();
    await expect(page).toHaveURL("/sign-up");
  });

  test("メールアドレス未入力ならバリデーションエラー", async ({ page }) => {
    await page.goto("/sign-up");

    await page.getByRole("textbox", { name: "パスワード" }).fill("password123");
    await page.getByRole("button", { name: "新規登録", exact: true }).click();

    await expect(
      page.getByText("メールアドレスを入力してください"),
    ).toBeVisible();
    await expect(page).toHaveURL("/sign-up");
  });

  test("パスワード未入力ならバリデーションエラー", async ({ page }) => {
    await page.goto("/sign-up");

    await page
      .getByRole("textbox", { name: "メールアドレス" })
      .fill(randomEmail());
    await page.getByRole("button", { name: "新規登録", exact: true }).click();

    await expect(page.getByText("パスワードを入力してください")).toBeVisible();
    await expect(page).toHaveURL("/sign-up");
  });

  test("パスワードが短い場合はバリデーションエラー", async ({ page }) => {
    await page.goto("/sign-up");

    await page
      .getByRole("textbox", { name: "メールアドレス" })
      .fill(randomEmail());
    await page.getByRole("textbox", { name: "パスワード" }).fill("12345");
    await page.getByRole("button", { name: "新規登録", exact: true }).click();

    await expect(
      page.getByText("パスワードは6文字以上で入力してください"),
    ).toBeVisible();
    await expect(page).toHaveURL("/sign-up");
  });

  test("新規登録ページにログインへのリンクが存在する", async ({ page }) => {
    await page.goto("/sign-up");
    await expect(page.getByRole("link", { name: "ログイン" })).toBeVisible();
  });
});
