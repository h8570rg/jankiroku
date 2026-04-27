import { expect, type Page, test } from "@playwright/test";
import {
  SEED_3PLAYER_MATCH_URL,
  SEED_MATCH_URL,
  SEED_OVERCAPACITY_MATCH_URL,
  TEST_USERS,
} from "./helpers";

// 点数入力の単位は100点単位 (e.g. "400" = 40000点)
// 4人・持ち点25000: 合計 1000 (= 100000 / 100)
// 3人・持ち点35000: 合計 1050 (= 105000 / 100)

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

// ─────────────────────────────────────────
// ゲーム結果入力フォーム (四麻・4人)
// ─────────────────────────────────────────
test.describe("ゲーム結果入力フォーム (4人)", () => {
  async function openDrawer(page: Page) {
    await page.goto(SEED_MATCH_URL);
    await page.getByRole("button", { name: "結果を入力する" }).click();
    await expect(page.getByRole("dialog", { name: "結果入力" })).toBeVisible();
  }

  test("4人分の入力欄が表示される", async ({ page }) => {
    await openDrawer(page);
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
    await openDrawer(page);
    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(page.getByText(/4人分の点数を入力してください/)).toBeVisible();
  });

  test("点数の合計が想定と異なるとエラー", async ({ page }) => {
    await openDrawer(page);

    await page
      .getByRole("spinbutton", { name: TEST_USERS.me.name })
      .fill("500");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.alice.name })
      .fill("250");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.bob.name })
      .fill("250");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.carol.name })
      .fill("100");

    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(
      page.getByText(/点数の合計が.*点になるように入力してください/),
    ).toBeVisible();
  });

  test("同点がある場合は並び替えボタンが表示される", async ({ page }) => {
    await openDrawer(page);

    await page
      .getByRole("spinbutton", { name: TEST_USERS.me.name })
      .fill("300");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.alice.name })
      .fill("300");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.bob.name })
      .fill("250");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.carol.name })
      .fill("150");

    await expect(page.getByText(/同点/)).toBeVisible();
  });

  test("0点未満のプレイヤーがいないのに飛ばした人を選ぶとエラー", async ({
    page,
  }) => {
    await openDrawer(page);

    await page
      .getByRole("spinbutton", { name: TEST_USERS.me.name })
      .fill("400");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.alice.name })
      .fill("300");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.bob.name })
      .fill("200");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.carol.name })
      .fill("100");

    await page.getByRole("button", { name: "飛ばした人" }).click();
    await page.getByRole("option", { name: TEST_USERS.alice.name }).click();

    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(
      page.getByText("0点を下回るプレイヤーがいません"),
    ).toBeVisible();
  });

  test("キャンセルでドロワーを閉じられる", async ({ page }) => {
    await openDrawer(page);
    await page.getByRole("button", { name: "キャンセル" }).click();
    await expect(
      page.getByRole("dialog", { name: "結果入力" }),
    ).not.toBeVisible();
  });

  // 以下は書き込みを伴うため最後に配置
  test("4人全員を手動で入力して保存できる", async ({ page }) => {
    await openDrawer(page);

    await page
      .getByRole("spinbutton", { name: TEST_USERS.me.name })
      .fill("400");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.alice.name })
      .fill("300");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.bob.name })
      .fill("200");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.carol.name })
      .fill("100");

    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(
      page.getByRole("dialog", { name: "結果入力" }),
    ).not.toBeVisible();
  });

  test("3人入力後に残り入力ボタンが出て自動補完して保存できる", async ({
    page,
  }) => {
    await openDrawer(page);

    await page
      .getByRole("spinbutton", { name: TEST_USERS.me.name })
      .fill("500");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.alice.name })
      .fill("300");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.bob.name })
      .fill("100");

    const autoFillBtn = page.getByRole("button", { name: "残り入力" }).first();
    await expect(autoFillBtn).toBeVisible();
    await autoFillBtn.click();

    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(
      page.getByRole("dialog", { name: "結果入力" }),
    ).not.toBeVisible();
  });
});

// ─────────────────────────────────────────
// ゲーム結果入力フォーム (三麻・3人)
// ─────────────────────────────────────────
test.describe("ゲーム結果入力フォーム (3人)", () => {
  async function openDrawer(page: Page) {
    await page.goto(SEED_3PLAYER_MATCH_URL);
    await page.getByRole("button", { name: "結果を入力する" }).click();
    await expect(page.getByRole("dialog", { name: "結果入力" })).toBeVisible();
  }

  test("3人分の入力欄のみ表示される", async ({ page }) => {
    await openDrawer(page);
    for (const user of [TEST_USERS.me, TEST_USERS.alice, TEST_USERS.bob]) {
      await expect(
        page.getByRole("spinbutton", { name: user.name }),
      ).toBeVisible();
    }
    await expect(
      page.getByRole("spinbutton", { name: TEST_USERS.carol.name }),
    ).not.toBeVisible();
  });

  test("点数未入力で保存するとエラー", async ({ page }) => {
    await openDrawer(page);
    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(page.getByText(/3人分の点数を入力してください/)).toBeVisible();
  });

  test("3人全員を手動で入力して保存できる", async ({ page }) => {
    await openDrawer(page);

    // 3人・持ち点35000 → 合計1050 (= 105000 / 100)
    await page
      .getByRole("spinbutton", { name: TEST_USERS.me.name })
      .fill("450");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.alice.name })
      .fill("350");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.bob.name })
      .fill("250");

    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(
      page.getByRole("dialog", { name: "結果入力" }),
    ).not.toBeVisible();
  });

  test("2人入力後に残り入力ボタンが出て自動補完して保存できる", async ({
    page,
  }) => {
    await openDrawer(page);

    await page
      .getByRole("spinbutton", { name: TEST_USERS.me.name })
      .fill("450");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.alice.name })
      .fill("350");

    const autoFillBtn = page.getByRole("button", { name: "残り入力" }).first();
    await expect(autoFillBtn).toBeVisible();
    await autoFillBtn.click();

    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(
      page.getByRole("dialog", { name: "結果入力" }),
    ).not.toBeVisible();
  });
});

// ─────────────────────────────────────────
// ゲーム結果入力フォーム (三麻ルール・参加者4人=超過)
// ─────────────────────────────────────────
test.describe("ゲーム結果入力フォーム (ルール人数超過: 三麻ルール・4人参加)", () => {
  async function openDrawer(page: Page) {
    await page.goto(SEED_OVERCAPACITY_MATCH_URL);
    await page.getByRole("button", { name: "結果を入力する" }).click();
    await expect(page.getByRole("dialog", { name: "結果入力" })).toBeVisible();
  }

  test("参加者全員(4人)の入力欄が表示される", async ({ page }) => {
    await openDrawer(page);
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

  test("全員(4人)入力するとルール人数(3人)と合わずエラー", async ({ page }) => {
    await openDrawer(page);

    await page
      .getByRole("spinbutton", { name: TEST_USERS.me.name })
      .fill("450");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.alice.name })
      .fill("350");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.bob.name })
      .fill("250");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.carol.name })
      .fill("0");

    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(page.getByText(/3人分の点数を入力してください/)).toBeVisible();
  });

  test("ルール人数(3人)分だけ入力して残りを空欄のまま保存できる", async ({
    page,
  }) => {
    await openDrawer(page);

    // carol は入力しない（空欄 = undefined → 集計対象外）
    await page
      .getByRole("spinbutton", { name: TEST_USERS.me.name })
      .fill("450");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.alice.name })
      .fill("350");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.bob.name })
      .fill("250");

    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(
      page.getByRole("dialog", { name: "結果入力" }),
    ).not.toBeVisible();
  });

  test("2人入力後に残り入力ボタンが出て自動補完できる（残り1人は空欄のまま保存）", async ({
    page,
  }) => {
    await openDrawer(page);

    await page
      .getByRole("spinbutton", { name: TEST_USERS.me.name })
      .fill("450");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.alice.name })
      .fill("350");

    const autoFillBtn = page.getByRole("button", { name: "残り入力" }).first();
    await expect(autoFillBtn).toBeVisible();
    await autoFillBtn.click();

    // 自動補完後: me=450, alice=350, bob=250(自動), carol=空欄 → 合計1050, 3人分 ✓
    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(
      page.getByRole("dialog", { name: "結果入力" }),
    ).not.toBeVisible();
  });
});

// ─────────────────────────────────────────
// チップ入力フォーム (四麻・4人)
// ─────────────────────────────────────────
test.describe("チップ入力フォーム (4人)", () => {
  async function openDrawer(page: Page) {
    await page.goto(SEED_MATCH_URL);
    await page.getByRole("button", { name: "チップを入力する" }).click();
    await expect(
      page.getByRole("dialog", { name: "チップ入力" }),
    ).toBeVisible();
  }

  test("4人分の入力欄が表示される", async ({ page }) => {
    await openDrawer(page);
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

  test("チップ合計が0以外だとドロワーが閉じない", async ({ page }) => {
    await openDrawer(page);

    await page.getByRole("spinbutton", { name: TEST_USERS.me.name }).fill("5");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.alice.name })
      .fill("3");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.bob.name })
      .fill("-2");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.carol.name })
      .fill("-1");

    await page.getByRole("button", { name: "保存", exact: true }).click();

    // 合計5 ≠ 0 のためエラー、ドロワーは閉じない
    await expect(
      page.getByRole("dialog", { name: "チップ入力" }),
    ).toBeVisible();
  });

  test("3人入力後に残り入力ボタンが出る", async ({ page }) => {
    await openDrawer(page);

    // 前のテストで carol のチップが保存されている場合に備えてクリア
    await page
      .getByRole("spinbutton", { name: TEST_USERS.carol.name })
      .fill("");
    await page.getByRole("spinbutton", { name: TEST_USERS.me.name }).fill("5");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.alice.name })
      .fill("-2");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.bob.name })
      .fill("-2");

    await expect(page.getByRole("button", { name: "残り入力" })).toBeVisible();
  });

  // 書き込み系は最後に配置
  test("合計0で保存するとドロワーが閉じる", async ({ page }) => {
    await openDrawer(page);

    await page.getByRole("spinbutton", { name: TEST_USERS.me.name }).fill("5");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.alice.name })
      .fill("-2");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.bob.name })
      .fill("-2");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.carol.name })
      .fill("-1");

    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(
      page.getByRole("dialog", { name: "チップ入力" }),
    ).not.toBeVisible();
  });
});

// ─────────────────────────────────────────
// チップ入力フォーム (三麻・3人)
// ─────────────────────────────────────────
test.describe("チップ入力フォーム (3人)", () => {
  async function openDrawer(page: Page) {
    await page.goto(SEED_3PLAYER_MATCH_URL);
    await page.getByRole("button", { name: "チップを入力する" }).click();
    await expect(
      page.getByRole("dialog", { name: "チップ入力" }),
    ).toBeVisible();
  }

  test("3人分の入力欄のみ表示される", async ({ page }) => {
    await openDrawer(page);
    for (const user of [TEST_USERS.me, TEST_USERS.alice, TEST_USERS.bob]) {
      await expect(
        page.getByRole("spinbutton", { name: user.name }),
      ).toBeVisible();
    }
    await expect(
      page.getByRole("spinbutton", { name: TEST_USERS.carol.name }),
    ).not.toBeVisible();
  });

  test("2人入力後に残り入力ボタンが出る", async ({ page }) => {
    await openDrawer(page);

    // 前のテストで bob のチップが保存されている場合に備えてクリア
    await page.getByRole("spinbutton", { name: TEST_USERS.bob.name }).fill("");
    await page.getByRole("spinbutton", { name: TEST_USERS.me.name }).fill("5");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.alice.name })
      .fill("-2");

    await expect(page.getByRole("button", { name: "残り入力" })).toBeVisible();
  });

  test("合計0で保存するとドロワーが閉じる", async ({ page }) => {
    await openDrawer(page);

    await page.getByRole("spinbutton", { name: TEST_USERS.me.name }).fill("5");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.alice.name })
      .fill("-2");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.bob.name })
      .fill("-3");

    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(
      page.getByRole("dialog", { name: "チップ入力" }),
    ).not.toBeVisible();
  });
});

// ─────────────────────────────────────────
// チップ入力フォーム (三麻ルール・参加者4人=超過)
// ─────────────────────────────────────────
test.describe("チップ入力フォーム (ルール人数超過: 三麻ルール・4人参加)", () => {
  async function openDrawer(page: Page) {
    await page.goto(SEED_OVERCAPACITY_MATCH_URL);
    await page.getByRole("button", { name: "チップを入力する" }).click();
    await expect(
      page.getByRole("dialog", { name: "チップ入力" }),
    ).toBeVisible();
  }

  test("ルール人数に関係なく参加者全員(4人)の入力欄が表示される", async ({
    page,
  }) => {
    await openDrawer(page);
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

  test("全参加者(4人)の合計が0で保存するとドロワーが閉じる", async ({
    page,
  }) => {
    await openDrawer(page);

    await page.getByRole("spinbutton", { name: TEST_USERS.me.name }).fill("5");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.alice.name })
      .fill("-2");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.bob.name })
      .fill("-2");
    await page
      .getByRole("spinbutton", { name: TEST_USERS.carol.name })
      .fill("-1");

    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(
      page.getByRole("dialog", { name: "チップ入力" }),
    ).not.toBeVisible();
  });
});
