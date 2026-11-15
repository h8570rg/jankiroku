import nextEnv from "@next/env";
import { defineConfig, devices } from "@playwright/test";

nextEnv.loadEnvConfig(process.cwd());

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
    ...devices["Pixel 7"],
    baseURL: `http://localhost:${process.env.E2E_PORT}`,
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
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "cleanup",
      testMatch: /logout\.spec\.ts/,
      use: {
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["chromium"],
    },
  ],

  webServer: {
    command: "pnpm exec next dev",
    wait: { stdout: /Local:\s+http:\/\/localhost:(?<e2e_port>\d+)/ },
  },
});
