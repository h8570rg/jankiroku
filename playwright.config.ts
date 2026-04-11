import { defineConfig, devices } from "@playwright/test";

const SUPABASE_LOCAL_URL = "http://127.0.0.1:54321";
const SUPABASE_LOCAL_PUBLISHABLE_KEY =
  "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
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
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],

  webServer: {
    command: "npm run dev -- -p 3003",
    url: "http://localhost:3003",
    reuseExistingServer: false,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: SUPABASE_LOCAL_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: SUPABASE_LOCAL_PUBLISHABLE_KEY,
    },
  },
});
