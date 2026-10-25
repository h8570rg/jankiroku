import { expect, test as setup } from "@playwright/test";
import { loginWithOtp, TEST_USERS } from "./helpers";

const authFile = "e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await loginWithOtp(page, TEST_USERS.me.email);

  await page.waitForURL("/matches");
  await expect(page).toHaveURL("/matches");

  await page.context().storageState({ path: authFile });
});
