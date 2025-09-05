import { expect, test } from "@playwright/test";

test.describe("Test login", () => {
  test("should login", async ({ page }) => {
    await page.goto("/login");
    await page.waitForTimeout(500);

    await page
      .getByRole("textbox", { name: "Email:" })
      .fill("thomas@shelbyltd.com");

    await page
      .getByRole("textbox", { name: "Password:" })
      .fill("Password1!", { force: true });
    await page.getByRole("button", { name: "Login" }).click();

    await page.waitForURL("http://localhost:3000/dashboard");

    await expect(page).toHaveURL("/dashboard");
  });

  test("should fail because of invalid credentials", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await page.waitForTimeout(500);

    await page
      .getByRole("textbox", { name: "Email:" })
      .fill("thomas@shelbyltd.com");
    await page.getByRole("textbox", { name: "Password:" }).fill("Password");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(
      page.getByText("Password must contain a digit."),
    ).toBeVisible();

    await page.getByRole("textbox", { name: "Password:" }).fill("Password2!");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Wrong password.")).toBeVisible();
  });
});
