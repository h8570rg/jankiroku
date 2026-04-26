import type { Locator, Page } from "@playwright/test";

/**
 * seed.sqlで事前作成されている四麻マッチのID
 * 参加プレイヤー: testuser, alice123, bob123, carol123 (4人)
 * ルール: 4人・持ち点25000・ゲーム/チップ未登録
 */
export const SEED_MATCH_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
export const SEED_MATCH_URL = `/matches/${SEED_MATCH_ID}`;

/**
 * seed.sqlで事前作成されている三麻マッチのID
 * 参加プレイヤー: testuser, alice123, bob123 (3人)
 * ルール: 3人・持ち点35000・ゲーム/チップ未登録
 */
export const SEED_3PLAYER_MATCH_ID = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
export const SEED_3PLAYER_MATCH_URL = `/matches/${SEED_3PLAYER_MATCH_ID}`;

/**
 * seed.sqlで事前作成されているルール人数超過マッチのID
 * 参加プレイヤー: testuser, alice123, bob123, carol123 (4人)
 * ルール: 3人・持ち点35000 (参加者4人 > ルール3人)
 * ゲーム/チップ未登録
 */
export const SEED_OVERCAPACITY_MATCH_ID =
  "cccccccc-cccc-cccc-cccc-cccccccccccc";
export const SEED_OVERCAPACITY_MATCH_URL = `/matches/${SEED_OVERCAPACITY_MATCH_ID}`;

/**
 * seed.sqlで用意されているテスト用ユーザー
 */
export const TEST_USERS = {
  me: {
    email: "test@example.com",
    password: "password123",
    displayId: "testuser",
    name: "テストユーザー",
  },
  alice: {
    email: "alice@example.com",
    password: "password123",
    displayId: "alice123",
    name: "アリス",
  },
  bob: {
    email: "bob@example.com",
    password: "password123",
    displayId: "bob123",
    name: "ボブ",
  },
  carol: {
    email: "carol@example.com",
    password: "password123",
    displayId: "carol123",
    name: "キャロル",
  },
} as const;

export function randomEmail() {
  const rand = Math.random().toString(36).slice(2, 10);
  return `e2e-${Date.now()}-${rand}@example.com`;
}

export function randomDisplayId() {
  return `u${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * WebKit では React Aria の controlled input に対して fill() が不安定なため、
 * pressSequentially() を使ってキーボードイベント経由で値を入力するヘルパー群。
 *
 * 原因: Playwright の fill() はプログラマティックに input イベントを発火するが、
 * WebKit では isTrusted:false のイベントを React が確実に処理しない場合がある。
 * pressSequentially() は実際のキーボードイベント連鎖を発生させるため安定して動作する。
 */

export async function fillEmail(page: Page, email: string) {
  const input = page.getByRole("textbox", { name: "メールアドレス" });
  await input.click();
  await input.pressSequentially(email);
}

export async function fillSearchbox(page: Page, value: string) {
  const input = page.getByRole("searchbox", { name: /検索|ユーザーID/ });
  await input.click();
  await input.pressSequentially(value);
}

export async function fillDisplayId(page: Page, value: string) {
  const input = page.getByRole("textbox", { name: "ユーザーID" });
  await input.click();
  await input.pressSequentially(value);
}

/**
 * 既存値がある場合も考慮して triple-click で全選択してから上書きする。
 * value が空文字の場合は Backspace で全削除する。
 */
export async function fillName(locator: Locator, value: string) {
  await locator.click({ clickCount: 3 });
  if (value === "") {
    await locator.press("Backspace");
  } else {
    await locator.pressSequentially(value);
  }
}
