import { expect, test } from "@playwright/test";
import {
  SEED_ALICE_ONLY_MATCH_DATE_LABEL,
  SEED_OLDEST_MATCH_ID,
  SEED_PAST_MATCH_IDS_NEWEST_FIRST,
} from "./helpers";

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
    // 過去対局は新しい順で並ぶ（1 ページ目に収まる範囲で確認）
    const pastPaths = SEED_PAST_MATCH_IDS_NEWEST_FIRST.map((id) => `/matches/${id}`);
    expect(paths.filter((path) => path && pastPaths.includes(path))).toEqual(pastPaths);
  });

  test("スクロールすると続きの成績表が読み込まれる", async ({ page }) => {
    await page.goto("/matches");
    const cards = page.locator('a[href^="/matches/"]');
    const oldestCard = page.locator(`a[href="/matches/${SEED_OLDEST_MATCH_ID}"]`);

    // 1 ページ目は 20 件で、最も古い対局はまだ表示されない
    await expect(cards).toHaveCount(20);
    await expect(oldestCard).toHaveCount(0);

    // 最も古い対局が出るまでスクロールして続きを読み込む
    await expect(async () => {
      await cards.last().scrollIntoViewIfNeeded();
      await expect(oldestCard).toBeVisible({ timeout: 1000 });
    }).toPass();

    // 重複なく全件が並ぶ
    const paths = await cards.evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")),
    );
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.at(-1)).toBe(`/matches/${SEED_OLDEST_MATCH_ID}`);
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
