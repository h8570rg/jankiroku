import { expect, test } from "@playwright/test";

test.describe("成績表 一覧ページ", () => {
  test("ページが表示される", async ({ page }) => {
    await page.goto("/matches");
    await expect(page.getByRole("heading", { name: "成績表" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "ゲームを始める" }),
    ).toBeVisible();
  });

  test("ゲームを始めるボタンでドロワーが開く", async ({ page }) => {
    await page.goto("/matches");
    await page.getByRole("button", { name: "ゲームを始める" }).click();

    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });
    await expect(dialog).toBeVisible();

    // ステッパー: 1. ルール設定, 2. プレイヤー選択
    await expect(dialog.getByText("ルール設定", { exact: true })).toBeVisible();
    await expect(
      dialog.getByText("プレイヤー選択", { exact: true }),
    ).toBeVisible();
  });

  test("ドロワーをキャンセルで閉じられる", async ({ page }) => {
    await page.goto("/matches");
    await page.getByRole("button", { name: "ゲームを始める" }).click();

    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });
    await expect(dialog).toBeVisible();

    await page.getByRole("button", { name: "キャンセル" }).click();
    await expect(dialog).not.toBeVisible();
  });
});
