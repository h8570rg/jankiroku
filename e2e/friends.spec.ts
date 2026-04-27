import { expect, test } from "@playwright/test";
import { fillInput, TEST_USERS } from "./helpers";

// 後半のテストは「削除 → 再追加で元に戻す」と順序依存になっているため、
// 前段が失敗したら後段をスキップして DB を壊れた状態で進めないように serial を指定する。
// （workers:1 だけでは失敗しても後続が続行されてしまう）
test.describe.configure({ mode: "serial" });

test.describe("フレンド管理", () => {
  test("フレンド検索ページが開ける", async ({ page }) => {
    await page.goto("/friends");
    await expect(page.getByRole("heading", { name: "フレンド" })).toBeVisible();

    const addLink = page.locator('a[href="/friends/add"]').first();
    await addLink.click();
    await expect(page).toHaveURL(/\/friends\/add/);
    await expect(
      page.getByRole("heading", { name: "フレンド追加" }),
    ).toBeVisible();
  });

  test("ユーザーIDで検索できる", async ({ page }) => {
    await page.goto("/friends/add");
    await fillInput(
      page.getByRole("searchbox", { name: /検索|ユーザーID/ }),
      TEST_USERS.alice.displayId,
    );

    await expect(page.getByText(TEST_USERS.alice.name)).toBeVisible();
    await expect(
      page.getByText(`@${TEST_USERS.alice.displayId}`),
    ).toBeVisible();
  });

  test("名前で検索できる", async ({ page }) => {
    await page.goto("/friends/add");
    await fillInput(
      page.getByRole("searchbox", { name: /検索|ユーザーID/ }),
      TEST_USERS.bob.name,
    );

    await expect(page.getByText(TEST_USERS.bob.name)).toBeVisible();
  });

  test("存在しないユーザーを検索すると見つかりませんと表示", async ({
    page,
  }) => {
    await page.goto("/friends/add");
    await fillInput(
      page.getByRole("searchbox", { name: /検索|ユーザーID/ }),
      "xxxxxxxxxxxxxxxxxxxx",
    );

    await expect(page.getByText("見つかりませんでした")).toBeVisible();
  });

  test("フレンドとして追加済みのユーザーは「追加済み」と表示される", async ({
    page,
  }) => {
    // seedでaliceはフレンドとして登録されている
    await page.goto("/friends/add");
    await fillInput(
      page.getByRole("searchbox", { name: /検索|ユーザーID/ }),
      TEST_USERS.alice.displayId,
    );

    await expect(page.getByText(TEST_USERS.alice.name)).toBeVisible();
    await expect(page.getByText("追加済み")).toBeVisible();
  });

  // 以下は state 変更を伴うため order 依存（削除 → 追加し直して元の状態に戻す）
  test("フレンドメニューから削除できる", async ({ page }) => {
    await page.goto("/friends");
    await expect(page.getByText(TEST_USERS.alice.name)).toBeVisible();

    // alice の行のメニューから削除
    const aliceRow = page
      .getByRole("listitem")
      .filter({ hasText: TEST_USERS.alice.name });
    await aliceRow.getByRole("button", { name: "フレンドメニュー" }).click();
    await page.getByRole("menuitem", { name: "削除" }).click();

    await expect(page.getByText(TEST_USERS.alice.name)).not.toBeVisible();
  });

  test("検索結果の「追加」ボタンからフレンド追加できる", async ({ page }) => {
    // 前テストで alice は削除済み
    await page.goto("/friends/add");
    await fillInput(
      page.getByRole("searchbox", { name: /検索|ユーザーID/ }),
      TEST_USERS.alice.displayId,
    );

    await expect(page.getByText(TEST_USERS.alice.name)).toBeVisible();
    await page.getByRole("button", { name: "追加", exact: true }).click();
    await expect(page.getByText("追加済み")).toBeVisible();

    await page.goto("/friends");
    await expect(page.getByText(TEST_USERS.alice.name)).toBeVisible();
  });
});
