import type { Locator } from "@playwright/test";

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
 * pressSequentially() を使ってキーボードイベント経由で値を入力するヘルパー。
 *
 * 原因: Playwright の fill() はプログラマティックに input イベントを発火するが、
 * WebKit では isTrusted:false のイベントを React が確実に処理しない場合がある。
 * pressSequentially() は実際のキーボードイベント連鎖を発生させるため安定して動作する。
 *
 * 既存値のクリアはこのヘルパーでは扱わない。テストは冪等であるべきで、
 * 既存値がある前提のテストは呼び出し側で明示的に clearInput を呼ぶ。
 */
export async function fillInput(locator: Locator, value: string) {
  await locator.click();
  await locator.pressSequentially(value);
}

/**
 * 入力欄の既存値を全選択して削除する。
 *
 * fillInput は pressSequentially でキーを順次入力するため、既存値があると
 * 上書きではなく末尾に追記されてしまう。seed データやプロフィール初期値が
 * 入っているフォームを操作するテストでは、入力前にこの関数で明示的に
 * クリアしてから fillInput を呼ぶ必要がある。
 */
export async function clearInput(locator: Locator) {
  await locator.click({ clickCount: 3 });
  await locator.press("Backspace");
}
