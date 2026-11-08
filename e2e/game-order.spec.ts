import { expect, type Page, test } from "@playwright/test";
import { SEED_GAME_ORDER_MATCH_URL, TEST_USERS } from "./helpers";

// seed の半荘（testuser / alice / bob の点数）
const SEED_GAME_1 = ["11", "0", "-11"];
const SEED_GAME_2 = ["22", "0", "-22"];
const SEED_GAME_3 = ["33", "0", "-33"];

// 結果入力 (三麻・持ち点35000、入力単位は100点): testuser 500 / alice 350 / bob 200
const NEW_GAME = ["25", "-5", "-20"];

// 成績表の半荘行（行番号セル + 各プレイヤーの点数セル）
function gameRows(page: Page) {
  return page.getByRole("button").filter({ hasText: /^\d+/ });
}

async function expectGameRows(page: Page, rows: string[][]) {
  const locator = gameRows(page);
  await expect(locator).toHaveCount(rows.length);
  for (const [index, scores] of rows.entries()) {
    await expect(locator.nth(index).locator("div")).toHaveText([String(index + 1), ...scores]);
  }
}

async function createGame(page: Page) {
  await page.getByRole("button", { name: "結果を入力する" }).click();
  const dialog = page.getByRole("dialog", { name: "結果入力" });
  await expect(dialog).toBeVisible();
  await page.getByRole("spinbutton", { name: TEST_USERS.me.name }).fill("500");
  await page.getByRole("spinbutton", { name: TEST_USERS.alice.name }).fill("350");
  await page.getByRole("spinbutton", { name: TEST_USERS.bob.name }).fill("200");
  await page.getByRole("button", { name: "保存", exact: true }).click();
  await expect(dialog).not.toBeVisible();
}

async function deleteGame(page: Page, index: number) {
  await gameRows(page).nth(index).click();
  const modal = page.getByRole("dialog", { name: `${index + 1}ゲーム目` });
  await expect(modal).toBeVisible();
  await modal.getByRole("button", { name: "削除" }).click();
  const confirm = page.getByRole("dialog", { name: "本当に削除しますか？" });
  await confirm.getByRole("button", { name: "削除" }).click();
  await expect(confirm).not.toBeVisible();
}

// 同じ seed マッチへ順に書き込むため、記述順に実行する
test.describe.configure({ mode: "serial" });

test.describe("半荘の表示順", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SEED_GAME_ORDER_MATCH_URL);
  });

  test("DB への登録順ではなく作成日時順に表示される", async ({ page }) => {
    await expectGameRows(page, [SEED_GAME_1, SEED_GAME_2, SEED_GAME_3]);
  });

  test("入力した半荘は末尾に追加される", async ({ page }) => {
    await createGame(page);

    await expectGameRows(page, [SEED_GAME_1, SEED_GAME_2, SEED_GAME_3, NEW_GAME]);
  });

  test("途中の半荘を削除した後に入力しても末尾に追加される", async ({ page }) => {
    await deleteGame(page, 0);
    await expectGameRows(page, [SEED_GAME_2, SEED_GAME_3, NEW_GAME]);

    await createGame(page);

    await expectGameRows(page, [SEED_GAME_2, SEED_GAME_3, NEW_GAME, NEW_GAME]);
  });
});
