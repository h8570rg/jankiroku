/**
 * seed.sqlで事前作成されている四麻マッチのID
 * 参加プレイヤー: testuser, alice123, bob123, carol123
 * ゲーム・チップは未登録の状態
 */
export const SEED_MATCH_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
export const SEED_MATCH_URL = `/matches/${SEED_MATCH_ID}`;

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
