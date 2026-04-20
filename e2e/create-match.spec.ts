import { expect, type Locator, type Page, test } from "@playwright/test";
import { TEST_USERS } from "./helpers";

async function openCreateMatchDrawer(page: Page) {
  await page.goto("/matches");
  await page.getByRole("button", { name: "ゲームを始める" }).click();
  await expect(page.getByRole("dialog", { name: "ゲーム作成" })).toBeVisible();
}

/**
 * HeroUIのRadioは視覚的に隠されたinput[type=radio]を使うため、
 * 通常のクリックは親要素のlabelに遮られる。
 * inputへのdispatchEventでチェックしたあと、変更イベントも明示的に発火させる。
 */
async function clickRadio(scope: Locator, name: string | RegExp, nth = 0) {
  const radio = scope.getByRole("radio", { name }).nth(nth);
  await radio.dispatchEvent("click");
}

test.describe("ゲーム作成 - ルール設定", () => {
  test("デフォルトは四麻", async ({ page }) => {
    await openCreateMatchDrawer(page);
    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });

    // プレイ人数が "四麻" のラジオがチェックされている
    await expect(dialog.getByRole("radio", { name: "四麻" })).toBeChecked();
  });

  test("三麻に切り替えるとウマ選択肢が3人用になる", async ({ page }) => {
    await openCreateMatchDrawer(page);
    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });

    await clickRadio(dialog, "三麻");
    await expect(dialog.getByRole("radio", { name: "三麻" })).toBeChecked();

    // 3人用ウマプリセット: ウマ10, ウマ20, ウマ30
    await expect(dialog.getByRole("radio", { name: "ウマ10" })).toBeVisible();
    await expect(dialog.getByRole("radio", { name: "ウマ20" })).toBeVisible();
    await expect(dialog.getByRole("radio", { name: "ウマ30" })).toBeVisible();
  });

  test("四麻時のウマプリセットが表示される", async ({ page }) => {
    await openCreateMatchDrawer(page);
    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });

    await expect(dialog.getByRole("radio", { name: "ゴットー" })).toBeVisible();
    await expect(dialog.getByRole("radio", { name: "ワンツー" })).toBeVisible();
    await expect(
      dialog.getByRole("radio", { name: "ワンスリー" }),
    ).toBeVisible();
  });

  test("レート選択肢が表示される", async ({ page }) => {
    await openCreateMatchDrawer(page);
    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });

    for (const label of [
      "テンイチ",
      "テンサン",
      "テンゴ",
      "テンピン",
      "リャンピン",
    ]) {
      await expect(dialog.getByRole("radio", { name: label })).toBeVisible();
    }
    // "なし" はレート以外にもウマ/チップで3箇所あるので件数のみ確認
    await expect(dialog.getByRole("radio", { name: "なし" })).toHaveCount(3);
  });

  test("ウマ カスタム: 合計が0にならないとエラー", async ({ page }) => {
    await openCreateMatchDrawer(page);
    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });

    await clickRadio(dialog, "カスタム", 0);

    await dialog.getByRole("spinbutton", { name: "1着" }).fill("10");
    await dialog.getByRole("spinbutton", { name: "2着" }).fill("5");
    await dialog.getByRole("spinbutton", { name: "3着" }).fill("-5");
    await dialog.getByRole("spinbutton", { name: "4着" }).fill("-5");

    await dialog.getByRole("button", { name: "プレイヤー選択へ" }).click();
    await expect(
      dialog.getByText("ウマの合計が0になるように入力してください"),
    ).toBeVisible();
  });

  test("ウマ カスタム: 4着が空欄ならエラー", async ({ page }) => {
    await openCreateMatchDrawer(page);
    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });

    await clickRadio(dialog, "カスタム", 0);

    await dialog.getByRole("spinbutton", { name: "1着" }).fill("10");
    await dialog.getByRole("spinbutton", { name: "2着" }).fill("5");
    await dialog.getByRole("spinbutton", { name: "3着" }).fill("-5");

    await dialog.getByRole("button", { name: "プレイヤー選択へ" }).click();
    await expect(dialog.getByText("ウマを入力してください")).toBeVisible();
  });

  test("チップ カスタム: 負数だとエラー", async ({ page }) => {
    await openCreateMatchDrawer(page);
    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });

    // "チップ" のラジオグループ内でカスタムを選択
    // オプションカードのカスタムは2箇所（ウマとチップ）あるので2番目
    await clickRadio(dialog, "カスタム", 1);

    await dialog.getByRole("spinbutton", { name: "カスタム" }).fill("-100");

    await dialog.getByRole("button", { name: "プレイヤー選択へ" }).click();
    await expect(
      dialog.getByText("チップレートは0以上で入力してください"),
    ).toBeVisible();
  });

  test("詳細設定を展開すると飛び賞・持ち点・オカ・計算が表示される", async ({
    page,
  }) => {
    await openCreateMatchDrawer(page);
    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });

    await dialog.getByRole("button", { name: "詳細設定" }).click();

    await expect(
      dialog.getByRole("spinbutton", { name: "飛び賞" }),
    ).toHaveValue("10000");
    await expect(
      dialog.getByRole("spinbutton", { name: "持ち点" }),
    ).toHaveValue("25000");
    await expect(dialog.getByRole("spinbutton", { name: "オカ" })).toHaveValue(
      "30000",
    );
  });

  test("三麻に切り替えると持ち点のデフォルトが35000になる", async ({
    page,
  }) => {
    await openCreateMatchDrawer(page);
    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });

    await clickRadio(dialog, "三麻");
    await dialog.getByRole("button", { name: "詳細設定" }).click();

    await expect(
      dialog.getByRole("spinbutton", { name: "持ち点" }),
    ).toHaveValue("35000");
    await expect(dialog.getByRole("spinbutton", { name: "オカ" })).toHaveValue(
      "40000",
    );
  });
});

test.describe("ゲーム作成 - プレイヤー選択", () => {
  async function goToPlayerStep(page: Page) {
    await openCreateMatchDrawer(page);
    await page.getByRole("button", { name: "プレイヤー選択へ" }).click();
    // ステップ2に到達
    await expect(
      page.getByRole("button", { name: "ゲーム開始" }),
    ).toBeVisible();
  }

  test("自分は最初から選択済みで削除できない", async ({ page }) => {
    await goToPlayerStep(page);

    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });
    await expect(dialog.getByText("選択中")).toBeVisible();
    await expect(dialog.getByText(TEST_USERS.me.name)).toBeVisible();
  });

  test("プレイヤーが足りないとエラー表示", async ({ page }) => {
    await goToPlayerStep(page);

    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });
    await dialog.getByRole("button", { name: "ゲーム開始" }).click();

    await expect(
      dialog.getByText("プレイヤーを4人以上選択してください"),
    ).toBeVisible();
  });

  test("ユーザー検索結果から追加・削除できる", async ({ page }) => {
    await goToPlayerStep(page);
    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });

    await dialog.getByRole("searchbox").fill(TEST_USERS.alice.displayId);

    const option = dialog
      .getByRole("option", { name: new RegExp(TEST_USERS.alice.name) })
      .first();
    await expect(option).toBeVisible();

    await option.click();

    // クリック後、「選択中」パラグラフが表示されAliceが含まれるようになる
    await expect(dialog.getByText("選択中")).toBeVisible();
    // option + 選択中チップの2箇所でAliceの名前が登場
    await expect(dialog.getByText(TEST_USERS.alice.name)).toHaveCount(2);
  });

  test("戻るボタンで1ステップ目に戻れる", async ({ page }) => {
    await goToPlayerStep(page);
    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });

    await dialog.getByRole("button", { name: "戻る" }).click();
    await expect(
      dialog.getByRole("button", { name: "プレイヤー選択へ" }),
    ).toBeVisible();
  });

  test("新規プレイヤー作成モーダル: 空だとエラー", async ({ page }) => {
    await goToPlayerStep(page);
    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });

    await dialog.getByRole("option", { name: "新規プレイヤー作成" }).click();

    const modal = page.getByRole("dialog", { name: "新規プレイヤー作成" });
    await expect(modal).toBeVisible();

    await modal.getByRole("button", { name: "決定" }).click();
    await expect(modal.getByText("名前を入力してください")).toBeVisible();
  });

  test("新規プレイヤー作成: 名前が長すぎるとエラー", async ({ page }) => {
    await goToPlayerStep(page);
    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });

    await dialog.getByRole("option", { name: "新規プレイヤー作成" }).click();
    const modal = page.getByRole("dialog", { name: "新規プレイヤー作成" });

    // NOTE: maxLength属性が設定されているので入力自体が12文字で切られる
    // バリデーションを発火させるため、直接DOMに13文字セット
    const input = modal.getByRole("textbox");
    await input.fill("あいうえおかきくけこさしす");

    // maxLength属性のため12文字までしか入力されない
    await expect(input).toHaveValue("あいうえおかきくけこさし");
  });

  test("新規プレイヤー作成: 成功すると選択中に追加される", async ({ page }) => {
    await goToPlayerStep(page);
    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });

    await dialog.getByRole("option", { name: "新規プレイヤー作成" }).click();
    const modal = page.getByRole("dialog", { name: "新規プレイヤー作成" });

    const playerName = `仮名${Date.now()}`.slice(0, 12);
    await modal.getByRole("textbox").fill(playerName);
    await modal.getByRole("button", { name: "決定" }).click();

    await expect(modal).not.toBeVisible();
    await expect(dialog.getByText(playerName)).toBeVisible();
  });
});

test.describe("ゲーム作成 - 完了フロー", () => {
  test("四麻・プレイヤー4人を指定してゲームを開始できる", async ({ page }) => {
    await openCreateMatchDrawer(page);
    await page.getByRole("button", { name: "プレイヤー選択へ" }).click();

    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });

    // seedでalice/bob/carolはフレンドに登録されているため、検索不要でデフォルトリストから選択できる
    for (const user of [TEST_USERS.alice, TEST_USERS.bob, TEST_USERS.carol]) {
      await dialog
        .getByRole("option", { name: new RegExp(user.name) })
        .first()
        .click();
    }

    await dialog.getByRole("button", { name: "ゲーム開始" }).click();

    await expect(page).toHaveURL(/\/matches\/[a-f0-9-]+/);
  });

  test("三麻・プレイヤー3人でゲームを開始できる", async ({ page }) => {
    await openCreateMatchDrawer(page);
    const dialog = page.getByRole("dialog", { name: "ゲーム作成" });

    await clickRadio(dialog, "三麻");
    await dialog.getByRole("button", { name: "プレイヤー選択へ" }).click();

    for (const user of [TEST_USERS.alice, TEST_USERS.bob]) {
      await dialog
        .getByRole("option", { name: new RegExp(user.name) })
        .first()
        .click();
    }

    await dialog.getByRole("button", { name: "ゲーム開始" }).click();
    await expect(page).toHaveURL(/\/matches\/[a-f0-9-]+/);
  });
});
