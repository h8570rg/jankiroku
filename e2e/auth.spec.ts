import { expect, test } from "@playwright/test";
import {
  getLatestOtp,
  loginWithOtp,
  randomEmail,
  requestOtpFromLoginPage,
  TEST_USERS,
} from "./helpers";

test.describe("ログイン", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("届いたコードを入力するとログインできる", async ({ page }) => {
    await loginWithOtp(page, TEST_USERS.me.email);

    await expect(page).toHaveURL("/matches");
  });

  test("未登録のメールアドレスでもコードでログインでき、登録ページへ進む", async ({ page }) => {
    await loginWithOtp(page, randomEmail());

    await expect(page).toHaveURL(/\/register/);
  });

  // 同一アドレスへの連続送信は Supabase の送信間隔制限にかかるため、ログイン以外のテストは毎回別アドレスを使う
  test("コード入力画面に伏せ字の送信先と再送までの待ち時間が表示される", async ({ page }) => {
    await requestOtpFromLoginPage(page, randomEmail());

    await expect(page.getByText("e***@example.com")).toBeVisible();
    await expect(page.getByRole("button", { name: /コードを再送（\d+秒後）/ })).toBeDisabled();
  });

  test("誤ったコードではログインできず、入力がクリアされる", async ({ page }) => {
    const email = randomEmail();
    await requestOtpFromLoginPage(page, email);
    const otp = await getLatestOtp(email);
    const wrongOtp = otp === "000000" ? "111111" : "000000";
    await page.getByRole("textbox", { name: "ログインコード" }).fill(wrongOtp);

    await expect(page.getByText("コードが正しくないか、有効期限が切れています")).toBeVisible();
    await expect(page.getByRole("textbox", { name: "ログインコード" })).toHaveValue("");
    await expect(page).toHaveURL("/login/verify");
  });

  test("コードが未入力ならバリデーションエラー", async ({ page }) => {
    await requestOtpFromLoginPage(page, randomEmail());
    await page.getByRole("button", { name: "ログイン", exact: true }).click();

    await expect(page.getByText("コードを入力してください", { exact: true })).toBeVisible();
    await expect(page).toHaveURL("/login/verify");
  });

  test("戻るボタンでメールアドレス入力に戻る", async ({ page }) => {
    await requestOtpFromLoginPage(page, randomEmail());
    await page.getByRole("link", { name: "戻る" }).click();

    await expect(page).toHaveURL("/login");
    await expect(page.getByRole("textbox", { name: "メールアドレス" })).toBeVisible();
  });

  test("コードを送信せずにコード入力画面を開くとログインページへ戻される", async ({ page }) => {
    await page.goto("/login/verify");

    await expect(page).toHaveURL("/login");
  });

  test("メールアドレス未入力ではバリデーションエラー", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: "ログインコードを送信", exact: true }).click();

    await expect(page.getByText("メールアドレスを入力してください")).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("メールアドレス形式が不正ならバリデーションエラー", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("textbox", { name: "メールアドレス" }).fill("not-an-email");
    await page.getByRole("button", { name: "ログインコードを送信", exact: true }).click();

    await expect(page.getByText("メールアドレスを正しい形式で入力してください")).toBeVisible();
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

  test("旧新規登録ページはログインページへリダイレクトされる", async ({ page }) => {
    await page.goto("/sign-up");
    await expect(page).toHaveURL("/login");
  });
});
