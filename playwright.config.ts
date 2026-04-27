import { defineConfig, devices } from "@playwright/test";

const SUPABASE_LOCAL_URL = "http://127.0.0.1:54321";
const SUPABASE_LOCAL_PUBLISHABLE_KEY =
  "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";

export default defineConfig({
  globalSetup: "./e2e/global-setup.ts",
  testDir: "./e2e",
  // global-setup で投入した Supabase の seed を全テストで共有しているため、
  // 並列化すると同一レコードへの書き込みが競合する。よって 1 ワーカーで順次実行する。
  fullyParallel: false,
  workers: 1,
  reporter: [["html", { outputFolder: "e2e/playwright-report" }]],
  outputDir: "e2e/test-results",

  use: {
    baseURL: "http://localhost:3003",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      // logout系はセッションを破壊するため cleanup プロジェクトで最後に実行する
      testIgnore: /logout\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "webkit",
      // logout系はセッションを破壊するため cleanup プロジェクトで最後に実行する
      testIgnore: /logout\.spec\.ts/,
      use: {
        ...devices["Desktop Safari"],
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "cleanup",
      testMatch: /logout\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["webkit"],
    },
  ],

  webServer: {
    command: "npm run dev -- -p 3003",
    url: "http://localhost:3003",
    env: {
      NEXT_PUBLIC_SUPABASE_URL: SUPABASE_LOCAL_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: SUPABASE_LOCAL_PUBLISHABLE_KEY,
    },
  },
});
