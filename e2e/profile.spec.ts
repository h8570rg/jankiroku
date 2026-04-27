import { expect, test } from "@playwright/test";
import { clearInput, fillInput, TEST_USERS } from "./helpers";

test.describe("プロフィール編集", () => {
  test("プロフィール情報が表示されている", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL("/profile");

    await expect(page.getByRole("textbox", { name: "ユーザーID" })).toHaveValue(
      TEST_USERS.me.displayId,
    );
    await expect(page.getByRole("textbox", { name: "名前" })).toHaveValue(
      TEST_USERS.me.name,
    );
  });

  test("ユーザーIDは変更できない（readonly）", async ({ page }) => {
    await page.goto("/profile");

    const displayIdInput = page.getByRole("textbox", { name: "ユーザーID" });
    await expect(displayIdInput).toBeDisabled();
    await expect(page.getByText("ユーザーIDは変更できません")).toBeVisible();
  });

  test("名前を空にするとバリデーションエラー", async ({ page }) => {
    await page.goto("/profile");

    // 名前欄には seed の初期値が入っているため、空文字での送信を再現するには
    // 明示的に clearInput でクリアする必要がある。
    await clearInput(page.getByRole("textbox", { name: "名前" }));
    await page.getByRole("button", { name: "保存", exact: true }).click();

    await expect(page.getByText("名前を入力してください")).toBeVisible();
  });

  test("名前が長すぎるとバリデーションエラー", async ({ page }) => {
    await page.goto("/profile");

    // 名前欄には seed の初期値が入っているため、新しい値だけを純粋に検証するには
    // 入力前に clearInput でクリアする（pressSequentially は末尾追記になるため）。
    await clearInput(page.getByRole("textbox", { name: "名前" }));
    await fillInput(
      page.getByRole("textbox", { name: "名前" }),
      "あ".repeat(13),
    );
    await page.getByRole("button", { name: "保存", exact: true }).click();

    await expect(
      page.getByText("名前は12文字以内で入力してください"),
    ).toBeVisible();
  });

  test("名前を変更して保存するとトーストが表示される", async ({ page }) => {
    await page.goto("/profile");

    const originalName = TEST_USERS.me.name;
    const newName = "テストユーザー改";

    // 名前欄には seed/保存済みの初期値が入っているため、上書きするには
    // 入力前に clearInput でクリアする（pressSequentially は末尾追記になるため）。
    await clearInput(page.getByRole("textbox", { name: "名前" }));
    await fillInput(page.getByRole("textbox", { name: "名前" }), newName);
    await page.getByRole("button", { name: "保存", exact: true }).click();

    await expect(page.getByText("プロフィールを更新しました")).toBeVisible();

    // ページを再読み込みして Conform の状態をリセットしてから元の名前に戻す
    await page.goto("/profile");
    await clearInput(page.getByRole("textbox", { name: "名前" }));
    await fillInput(page.getByRole("textbox", { name: "名前" }), originalName);
    await page.getByRole("button", { name: "保存", exact: true }).click();
    await expect(page.getByText("プロフィールを更新しました")).toBeVisible();
  });
});
