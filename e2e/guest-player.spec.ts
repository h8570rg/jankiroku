import { expect, type Page, test } from "@playwright/test";
import { fillInput, SEED_3PLAYER_MATCH_URL, TEST_USERS } from "./helpers";

async function openCreateMatchPlayerStep(page: Page) {
  await page.goto("/matches");
  await page.getByRole("button", { name: "ゲームを始める" }).click();
  const dialog = page.getByRole("dialog", { name: "ゲーム作成" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "プレイヤー選択へ" }).click();
  return dialog;
}

async function createGuestInDialog(
  dialog: ReturnType<Page["getByRole"]>,
  name: string,
) {
  await dialog.getByRole("option", { name: "新規プレイヤー作成" }).click();
  const modal = dialog
    .page()
    .getByRole("dialog", { name: "新規プレイヤー作成" });
  await modal.getByRole("textbox").fill(name);
  await modal.getByRole("button", { name: "決定" }).click();
  await expect(modal).not.toBeVisible();
}

test.describe("ゲストプレイヤー", () => {
  test("ゲスト含む4人でマッチを作成すると詳細ページにゲストが表示される", async ({
    page,
  }) => {
    const dialog = await openCreateMatchPlayerStep(page);

    const guestName = `g${Date.now().toString().slice(-8)}`;
    await createGuestInDialog(dialog, guestName);

    // 既存フレンド 2 人を追加して計 4 人 (自分 + alice + bob + guest)
    for (const user of [TEST_USERS.alice, TEST_USERS.bob]) {
      await dialog
        .getByRole("option", { name: new RegExp(user.name) })
        .first()
        .click();
    }

    await dialog.getByRole("button", { name: "ゲーム開始" }).click();
    await expect(page).toHaveURL(/\/matches\/[a-f0-9-]+/);

    // マッチ詳細にゲスト名が表示される
    await expect(page.getByText(guestName).first()).toBeVisible();
  });

  test("プレイヤー追加ドロワーからゲストを追加 → 再読み込み後も残っている", async ({
    page,
  }) => {
    await page.goto(SEED_3PLAYER_MATCH_URL);
    await page.getByRole("button", { name: "プレイヤーを追加" }).click();

    const drawer = page.getByRole("dialog", { name: "プレイヤー選択" });
    await expect(drawer).toBeVisible();

    const guestName = `g${Date.now().toString().slice(-8)}`;
    await createGuestInDialog(drawer, guestName);

    await drawer.getByRole("button", { name: "決定" }).click();
    await expect(drawer).not.toBeVisible();

    await page.reload();
    await expect(page.getByText(guestName).first()).toBeVisible();
  });

  test("マッチ作成のプレイヤー検索でゲストはヒットしない", async ({ page }) => {
    // 一意の名前でゲストを作っておく
    const dialog = await openCreateMatchPlayerStep(page);
    const guestName = `g${Date.now().toString().slice(-8)}`;
    await createGuestInDialog(dialog, guestName);

    // 同じドロワー内で検索 (selected には残るが search 結果には出ない)
    await dialog.getByRole("searchbox").fill(guestName);
    await expect(
      dialog.getByText("ユーザーが見つかりませんでした"),
    ).toBeVisible();
  });

  test("フレンド検索でゲストはヒットしない", async ({ page }) => {
    // 一意の名前でゲストを作成
    const dialog = await openCreateMatchPlayerStep(page);
    const guestName = `g${Date.now().toString().slice(-8)}`;
    await createGuestInDialog(dialog, guestName);

    // フレンド追加画面に移動して検索
    await page.goto("/friends/add");
    await fillInput(
      page.getByRole("searchbox", { name: /検索|ユーザーID/ }),
      guestName,
    );

    await expect(page.getByText("見つかりませんでした")).toBeVisible();
  });
});
