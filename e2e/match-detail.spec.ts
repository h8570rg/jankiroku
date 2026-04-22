import { expect, type Locator, type Page, test } from "@playwright/test";
import { SEED_MATCH_URL, TEST_USERS } from "./helpers";

async function fillSpinbutton(page: Page, locator: Locator, value: string) {
  await locator.evaluate((el: HTMLInputElement) => {
    el.focus();
    el.select();
  });
  await page.keyboard.type(value);
  await page.keyboard.press("Tab");
}

test.describe("成績詳細ページ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SEED_MATCH_URL);
  });

  test("ヘッダーと結果入力・チップ入力・ルール確認ボタンが表示される", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: "結果を入力する" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "チップを入力する" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "ルールを確認" }),
    ).toBeVisible();
  });

  test("ルールモーダルを開ける", async ({ page }) => {
    await page.getByRole("button", { name: "ルールを確認" }).click();
    const modal = page.getByRole("dialog", { name: "ルール" });
    await expect(modal).toBeVisible();
    await expect(modal.getByText("プレイ人数")).toBeVisible();
    await expect(modal.getByText("4人")).toBeVisible();
  });

  test("プレイヤー追加ドロワーを開ける", async ({ page }) => {
    await page.getByRole("button", { name: "プレイヤーを追加" }).click();
    await expect(
      page.getByRole("dialog", { name: "プレイヤー選択" }),
    ).toBeVisible();
  });

  test("戻るボタンで/matchesに戻れる", async ({ page }) => {
    await page.getByRole("link", { name: "戻る" }).click();
    await expect(page).toHaveURL("/matches");
  });
});

test.describe("ゲーム結果入力フォーム", () => {
  async function openCreateGameDrawer(page: Page) {
    await page.goto(SEED_MATCH_URL);
    await page.getByRole("button", { name: "結果を入力する" }).click();
    await expect(
      page.getByRole("dialog", { name: /結果入力|ゲーム/ }),
    ).toBeVisible();
  }

  test("全プレイヤーの入力欄が表示される", async ({ page }) => {
    await openCreateGameDrawer(page);
    for (const user of [
      TEST_USERS.me,
      TEST_USERS.alice,
      TEST_USERS.bob,
      TEST_USERS.carol,
    ]) {
      await expect(
        page.getByRole("spinbutton", { name: user.name }),
      ).toBeVisible();
    }
  });

  test("点数未入力で保存するとエラー", async ({ page }) => {
    await openCreateGameDrawer(page);

    await page.getByRole("button", { name: "保存", exact: true }).click();

    await expect(page.getByText(/4人分の点数を入力してください/)).toBeVisible();
  });

  test("点数の合計が想定と異なるとエラー", async ({ page }) => {
    await openCreateGameDrawer(page);

    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.me.name }),
      "500",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.alice.name }),
      "250",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.bob.name }),
      "250",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.carol.name }),
      "100",
    );

    await page.getByRole("button", { name: "保存", exact: true }).click();

    await expect(
      page.getByText(/点数の合計が.*点になるように入力してください/),
    ).toBeVisible();
  });

  test("同点がある場合は並び替えボタンが表示される", async ({ page }) => {
    await openCreateGameDrawer(page);

    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.me.name }),
      "300",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.alice.name }),
      "300",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.bob.name }),
      "250",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.carol.name }),
      "150",
    );

    await expect(page.getByText(/同点/)).toBeVisible();
  });

  test("0点未満のプレイヤーがいないのに飛ばした人を選ぶとエラー", async ({
    page,
  }) => {
    await openCreateGameDrawer(page);

    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.me.name }),
      "400",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.alice.name }),
      "300",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.bob.name }),
      "200",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.carol.name }),
      "100",
    );

    await page.getByRole("button", { name: /なし|飛ばした人/ }).click();
    await page.getByRole("option", { name: TEST_USERS.alice.name }).click();

    await page.getByRole("button", { name: "保存", exact: true }).click();

    await expect(
      page.getByText("0点を下回るプレイヤーがいません"),
    ).toBeVisible();
  });

  test("キャンセルでドロワーを閉じられる", async ({ page }) => {
    await openCreateGameDrawer(page);

    await page.getByRole("button", { name: "キャンセル" }).click();
    await expect(
      page.getByRole("dialog", { name: /結果入力/ }),
    ).not.toBeVisible();
  });

  // 書き込み系の最後に実行（ゲーム行が1件増えるがドロワー初期状態には影響しない）
  test("3人分埋まると残りの『残り入力』ボタンが出て自動補完できる", async ({
    page,
  }) => {
    await openCreateGameDrawer(page);

    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.me.name }),
      "500",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.alice.name }),
      "300",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.bob.name }),
      "100",
    );

    const autoFillBtn = page.getByRole("button", { name: "残り入力" }).first();
    await expect(autoFillBtn).toBeVisible();
    await autoFillBtn.click();

    await page.getByRole("button", { name: "保存", exact: true }).click();

    await expect(
      page.getByRole("dialog", { name: /結果入力/ }),
    ).not.toBeVisible();
  });
});

test.describe("チップ入力フォーム", () => {
  async function openChipDrawer(page: Page) {
    await page.goto(SEED_MATCH_URL);
    await page.getByRole("button", { name: "チップを入力する" }).click();
    await expect(page.getByRole("dialog", { name: /チップ/ })).toBeVisible();
  }

  test("プレイヤーごとのチップ入力欄が並んでいる", async ({ page }) => {
    await openChipDrawer(page);

    for (const user of [
      TEST_USERS.me,
      TEST_USERS.alice,
      TEST_USERS.bob,
      TEST_USERS.carol,
    ]) {
      await expect(
        page.getByRole("spinbutton", { name: user.name }),
      ).toBeVisible();
    }
  });

  test("チップ合計が0以外だとエラー", async ({ page }) => {
    await openChipDrawer(page);

    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.me.name }),
      "5",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.alice.name }),
      "3",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.bob.name }),
      "-2",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.carol.name }),
      "-1",
    );

    await page.getByRole("button", { name: "保存", exact: true }).click();

    // 合計が合わないためドロワーは閉じずに留まる
    await expect(page.getByRole("dialog", { name: /チップ/ })).toBeVisible();
  });

  test("3人分埋めると『残り入力』ボタンが出る", async ({ page }) => {
    await openChipDrawer(page);

    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.me.name }),
      "5",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.alice.name }),
      "-2",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.bob.name }),
      "-2",
    );
    await page
      .getByRole("spinbutton", { name: TEST_USERS.carol.name })
      .fill("");

    await expect(page.getByRole("button", { name: "残り入力" })).toBeVisible();
  });

  // 書き込み系の最後に実行（これ以降チップ値が保存されるため）
  test("合計0で保存するとドロワーが閉じる", async ({ page }) => {
    await openChipDrawer(page);

    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.me.name }),
      "5",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.alice.name }),
      "-2",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.bob.name }),
      "-2",
    );
    await fillSpinbutton(
      page,
      page.getByRole("spinbutton", { name: TEST_USERS.carol.name }),
      "-1",
    );

    await page.getByRole("button", { name: "保存", exact: true }).click();

    await expect(
      page.getByRole("dialog", { name: /チップ/ }),
    ).not.toBeVisible();
  });
});
