import { expect, test } from "@playwright/test";
import { SEED_ALICE_ONLY_MATCH_DATE_LABEL, SEED_PAST_MATCH_IDS_NEWEST_FIRST } from "./helpers";

test.describe("成績表 一覧ページ", () => {
  test("ページが表示される", async ({ page }) => {
    await page.goto("/matches");
    await expect(page.getByRole("tab", { name: "成績表" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "フレンド" })).toBeVisible();
    await expect(page.getByRole("button", { name: "ゲームを始める" })).toBeVisible();
  });

  test("他ユーザー単独の対局は一覧に出ない", async ({ page }) => {
    await page.goto("/matches");
    await expect(page.getByText(SEED_ALICE_ONLY_MATCH_DATE_LABEL)).not.toBeVisible();
  });

  test("成績表が新しい順に並ぶ", async ({ page }) => {
    await page.goto("/matches");
    const cards = page.locator('a[href^="/matches/"]');
    await expect(cards.first()).toBeVisible();

    const paths = await cards.evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")),
    );
    // 過去対局は当日作成の対局より後ろに、新しい順で並ぶ
    expect(paths.slice(-SEED_PAST_MATCH_IDS_NEWEST_FIRST.length)).toEqual(
      SEED_PAST_MATCH_IDS_NEWEST_FIRST.map((id) => `/matches/${id}`),
    );
  });

  test("ゲームを始めるボタンでドロワーが開く", async ({ page }) => {
    await page.goto("/matches");
    await page.getByRole("button", { name: "ゲームを始める" }).click();

    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });
    await expect(dialog).toBeVisible();

    // ステッパー: 1. ルール設定, 2. プレイヤー選択
    await expect(dialog.getByText("ルール設定", { exact: true })).toBeVisible();
    await expect(dialog.getByText("プレイヤー選択", { exact: true })).toBeVisible();
  });

  test("フレンドタブに切り替えられる", async ({ page }) => {
    await page.goto("/matches");
    await page.getByRole("tab", { name: "フレンド" }).click();
    await expect(page).toHaveURL("/friends");
    await expect(page.getByRole("searchbox", { name: /検索|ユーザーID/ })).toBeVisible();
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
