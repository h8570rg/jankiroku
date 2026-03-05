import { expect, test as setup } from "@playwright/test";

const authFile = "e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");

  await page
    .getByRole("textbox", { name: "メールアドレス" })
    .fill("test@example.com");
  await page.getByRole("textbox", { name: "パスワード" }).fill("password123");
  await page.getByRole("button", { name: "ログイン", exact: true }).click();

  await page.waitForURL("/matches");
  await expect(page).toHaveURL("/matches");

  await page.evaluate(() => {
    localStorage.setItem("lastVersion", "999.0.0");
  });

  await page.context().storageState({ path: authFile });
});
