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
export const SEED_OVERCAPACITY_MATCH_ID = "cccccccc-cccc-cccc-cccc-cccccccccccc";
export const SEED_OVERCAPACITY_MATCH_URL = `/matches/${SEED_OVERCAPACITY_MATCH_ID}`;

/**
 * seed.sqlで事前作成されているゲスト追加テスト専用マッチのID
 * 参加プレイヤー: testuser, alice123, bob123 (3人)
 * ルール: 3人・持ち点35000・ゲーム/チップ未登録
 * guest-player.spec.ts のみが書き込む（他の E2E テストと分離）
 */
export const SEED_GUEST_ADD_MATCH_ID = "dddddddd-dddd-dddd-dddd-dddddddddddd";
export const SEED_GUEST_ADD_MATCH_URL = `/matches/${SEED_GUEST_ADD_MATCH_ID}`;

/**
 * seed.sqlで事前作成されている四麻ルール・5人参加マッチのID
 * 参加プレイヤー: testuser, alice123, bob123, carol123, デイブ(ゲスト) (5人)
 * ルール: 4人・持ち点25000 (参加者5人 > ルール4人)
 * ゲーム/チップ未登録
 */
export const SEED_4RULE_5PLAYER_MATCH_ID = "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee";
export const SEED_4RULE_5PLAYER_MATCH_URL = `/matches/${SEED_4RULE_5PLAYER_MATCH_ID}`;

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
  /** seed.sql に事前投入されているゲストプレイヤー */
  dave: {
    name: "デイブ",
  },
} as const;

export function randomEmail() {
  const rand = Math.random().toString(36).slice(2, 10);
  return `e2e-${Date.now()}-${rand}@example.com`;
}

export function randomDisplayId() {
  return `u${Math.random().toString(36).slice(2, 10)}`;
}
