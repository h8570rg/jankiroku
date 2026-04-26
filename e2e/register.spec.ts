import { expect, type Page, test } from "@playwright/test";
import {
  fillDisplayId,
  fillEmail,
  fillName,
  randomDisplayId,
  randomEmail,
} from "./helpers";

async function createFreshSignedUpUser(page: Page) {
  await page.goto("/sign-up");
  await fillEmail(page, randomEmail());
  await page.getByRole("textbox", { name: "パスワード" }).fill("password123");
  await page.getByRole("button", { name: "新規登録", exact: true }).click();
  await page.waitForURL(/\/register/);
}

/**
 * プロフィール未登録ユーザーのstorageStateを使い、毎回サインアップせず /register に直接アクセスする。
 * いずれもフォームのバリデーション確認のみでプロフィール情報は保存しないため、
 * seed ユーザーを使い回しても汚染されない。
 */
test.describe("ユーザー情報登録 - バリデーション", () => {
  test.use({ storageState: "e2e/.auth/unregistered.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("ユーザーIDを入力せずに送信するとバリデーションエラー", async ({
    page,
  }) => {
    await fillName(page.getByRole("textbox", { name: "名前" }), "テスト");
    await page.getByRole("button", { name: "決定", exact: true }).click();
    await expect(page.getByText("ユーザーIDを入力してください")).toBeVisible();
  });

  test("名前を入力せずに送信するとバリデーションエラー", async ({ page }) => {
    await fillDisplayId(page, randomDisplayId());
    await page.getByRole("button", { name: "決定", exact: true }).click();
    await expect(page.getByText("名前を入力してください")).toBeVisible();
  });

  test("ユーザーIDが短いとバリデーションエラー", async ({ page }) => {
    await fillDisplayId(page, "abc");
    await fillName(page.getByRole("textbox", { name: "名前" }), "テスト");
    await page.getByRole("button", { name: "決定", exact: true }).click();
    await expect(
      page.getByText("ユーザーIDは4文字以上で入力してください"),
    ).toBeVisible();
  });

  test("ユーザーIDが長すぎるとバリデーションエラー", async ({ page }) => {
    await fillDisplayId(page, "a".repeat(13));
    await fillName(page.getByRole("textbox", { name: "名前" }), "テスト");
    await page.getByRole("button", { name: "決定", exact: true }).click();
    await expect(
      page.getByText("ユーザーIDは12文字以内で入力してください"),
    ).toBeVisible();
  });

  test("ユーザーIDに半角英数字以外を含むとバリデーションエラー", async ({
    page,
  }) => {
    await fillDisplayId(page, "ユーザー");
    await fillName(page.getByRole("textbox", { name: "名前" }), "テスト");
    await page.getByRole("button", { name: "決定", exact: true }).click();
    await expect(
      page.getByText("ユーザーIDは半角英数字のみで入力してください"),
    ).toBeVisible();
  });

  test("すでに使われているユーザーIDを指定するとエラー", async ({ page }) => {
    await fillDisplayId(page, "testuser");
    await fillName(page.getByRole("textbox", { name: "名前" }), "別ユーザー");
    await page.getByRole("button", { name: "決定", exact: true }).click();
    await expect(page.getByText("このIDは既に使用されています")).toBeVisible();
  });

  test("名前が長すぎるとバリデーションエラー", async ({ page }) => {
    await fillDisplayId(page, randomDisplayId());
    await fillName(
      page.getByRole("textbox", { name: "名前" }),
      "あ".repeat(13),
    );
    await page.getByRole("button", { name: "決定", exact: true }).click();
    await expect(
      page.getByText("名前は12文字以内で入力してください"),
    ).toBeVisible();
  });
});

/**
 * プロフィール登録/ログアウトはユーザー状態を変化させるため、
 * テスト毎に新規サインアップしたユーザーを使う。
 */
test.describe("ユーザー情報登録 - 副作用を伴うフロー", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("正しい情報で登録すると /matches に遷移する", async ({ page }) => {
    await createFreshSignedUpUser(page);

    await fillDisplayId(page, randomDisplayId());
    await fillName(page.getByRole("textbox", { name: "名前" }), "新規ユーザー");
    await page.getByRole("button", { name: "決定", exact: true }).click();

    await expect(page).toHaveURL("/matches");
  });

  test("登録ページからログアウトするとログインページへ", async ({ page }) => {
    await createFreshSignedUpUser(page);

    await page.getByRole("button", { name: "ログアウト" }).click();

    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("登録済みユーザーの /register アクセス", () => {
  test("登録済みユーザーが/registerに直接アクセスすると/matchesにリダイレクト", async ({
    page,
  }) => {
    await page.goto("/register");
    await expect(page).toHaveURL("/matches");
  });
});
