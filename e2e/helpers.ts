import type { Page } from "@playwright/test";

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
 * seed.sql の testuser 非参加マッチ。一覧カードは日付 2020/1/15 で識別する
 */
export const SEED_ALICE_ONLY_MATCH_DATE_LABEL = "2020/1/15";

/**
 * seed.sql の testuser 参加の過去マッチ。新しい順（2023/5/10 → 2022/8/20 → 2021/3/1）
 * seed では古い順に INSERT しているため、created_at で並べないと順序が崩れる
 */
export const SEED_PAST_MATCH_IDS_NEWEST_FIRST = [
  "0a000000-0000-0000-0000-000000000003",
  "0a000000-0000-0000-0000-000000000002",
  "0a000000-0000-0000-0000-000000000001",
] as const;

/**
 * seed.sql の無限スクロール確認用マッチ（testuser 単独・2015/1/2〜2015/1/26 の25件）のうち最も古いもの
 */
export const SEED_OLDEST_MATCH_ID = "0b000000-0000-0000-0000-000000000001";

/**
 * seed.sqlで用意されているテスト用ユーザー
 */
export const TEST_USERS = {
  me: {
    email: "test@example.com",
    displayId: "testuser",
    name: "テストユーザー",
  },
  alice: {
    email: "alice@example.com",
    displayId: "alice123",
    name: "アリス",
  },
  bob: {
    email: "bob@example.com",
    displayId: "bob123",
    name: "ボブ",
  },
  carol: {
    email: "carol@example.com",
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

/** supabase/config.toml の [local_smtp] で起動する Mailpit */
const MAILPIT_URL = "http://127.0.0.1:54324";

type MailpitSearchResult = { messages: { ID: string }[] };
type MailpitMessage = { Text: string };

/** 指定アドレス宛のメールをすべて削除する（古いコードを拾わないため） */
export async function clearMailbox(email: string) {
  await fetch(`${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(`to:"${email}"`)}`, {
    method: "DELETE",
  });
}

/** 指定アドレス宛に届いた最新のログインコードを取得する */
export async function getLatestOtp(email: string): Promise<string> {
  const query = encodeURIComponent(`to:"${email}"`);
  for (let i = 0; i < 50; i++) {
    const search = (await (
      await fetch(`${MAILPIT_URL}/api/v1/search?query=${query}&limit=1`)
    ).json()) as MailpitSearchResult;
    const id = search.messages[0]?.ID;
    if (id) {
      const message = (await (
        await fetch(`${MAILPIT_URL}/api/v1/message/${id}`)
      ).json()) as MailpitMessage;
      const code = message.Text.match(/\b(\d{6})\b/)?.[1];
      if (code) return code;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`OTP mail for ${email} not found`);
}

/** ログイン画面でメールアドレスを送信し、コード入力画面へ進む */
export async function requestOtpFromLoginPage(page: Page, email: string) {
  await clearMailbox(email);
  await page.goto("/login");
  await page.getByRole("textbox", { name: "メールアドレス" }).fill(email);
  await page.getByRole("button", { name: "ログインコードを送信", exact: true }).click();
  await page.waitForURL("/login/verify");
}

/** メールアドレスを送信し、届いたコードを入力するまでを行う（6 桁そろうと自動送信される） */
export async function loginWithOtp(page: Page, email: string) {
  await requestOtpFromLoginPage(page, email);
  const otp = await getLatestOtp(email);
  await page.getByRole("textbox", { name: "ログインコード" }).fill(otp);
}
