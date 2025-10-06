import { expect, test } from "@playwright/test";

test.describe("Test profile page", () => {
  test("should load profile page", async ({ page }) => {
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

    await page.goto("/dashboard/profile");
    await page.waitForURL("/dashboard/profile");

    await page.waitForTimeout(500);

    // Check that the page has loaded with user and company cards
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByText("User Profile")).toBeVisible();
    await expect(page.getByText("Company info")).toBeVisible();
  });

  test("should have user form fields", async ({ page }) => {
    await page.goto("/login");
    await page.waitForTimeout(500);

    await page
      .getByRole("textbox", { name: "Email:" })
      .fill("thomas@shelbyltd.com");
    await page
      .getByRole("textbox", { name: "Password:" })
      .fill("Password1!", { force: true });
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForURL("/dashboard");

    await page.goto("/dashboard/profile");
    await page.waitForURL("/dashboard/profile");

    // Check user form fields
    await expect(page.getByLabel("Full name:")).toBeVisible();
    await expect(page.getByLabel("Email address:")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Update account" }),
    ).toBeVisible();
  });

  test("should have company form fields", async ({ page }) => {
    await page.goto("/login");
    await page.waitForTimeout(500);

    await page
      .getByRole("textbox", { name: "Email:" })
      .fill("thomas@shelbyltd.com");
    await page
      .getByRole("textbox", { name: "Password:" })
      .fill("Password1!", { force: true });
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForURL("/dashboard");

    await page.goto("/dashboard/profile");
    await page.waitForURL("/dashboard/profile");

    // Check company form fields
    await expect(page.getByLabel("Company name:")).toBeVisible();
    await expect(page.getByLabel("Company email:")).toBeVisible();
    await expect(page.getByLabel("Company phone number:")).toBeVisible();
    await expect(page.getByLabel("Company address:")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Update company" }),
    ).toBeVisible();
  });

  test("should show validation errors for user form", async ({ page }) => {
    await page.goto("/login");
    await page.waitForTimeout(500);

    await page
      .getByRole("textbox", { name: "Email:" })
      .fill("thomas@shelbyltd.com");
    await page
      .getByRole("textbox", { name: "Password:" })
      .fill("Password1!", { force: true });
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForURL("/dashboard");

    await page.goto("/dashboard/profile");
    await page.waitForURL("/dashboard/profile");

    // Fill invalid data in user form
    await page.getByLabel("Full name:").fill("A");
    await page.getByLabel("Email address:").fill("invalid@email");
    await page.getByRole("button", { name: "Update account" }).click();

    await page.waitForTimeout(500);

    // Check for errors
    await expect(
      page.getByText("Name should have at least 4 characters."),
    ).toBeVisible();
    await expect(page.getByText("Invalid email address")).toBeVisible();
  });

  test("should show validation errors for company form", async ({ page }) => {
    await page.goto("/login");
    await page.waitForTimeout(500);

    await page
      .getByRole("textbox", { name: "Email:" })
      .fill("thomas@shelbyltd.com");
    await page
      .getByRole("textbox", { name: "Password:" })
      .fill("Password1!", { force: true });
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForURL("/dashboard");

    await page.goto("/dashboard/profile");
    await page.waitForURL("/dashboard/profile");

    await page.waitForTimeout(500);

    await page.getByLabel("Company name:").fill("ABC");
    await page.getByLabel("Company email:").fill("invalid@mail");
    await page.getByLabel("Company phone number:").fill("123");
    await page.getByLabel("Company address:").fill("Short");
    await page.getByRole("button", { name: "Update company" }).click();

    await page.waitForTimeout(500);

    // Check for errors
    await expect(
      page.getByText("Company name should have at least 5 characters."),
    ).toBeVisible();
    await expect(page.getByText("Invalid email address")).toBeVisible();
    await expect(
      page.getByText("Phone number should contain at least 10 digits."),
    ).toBeVisible();
    await expect(
      page.getByText("Address should have at least 10 characters."),
    ).toBeVisible();
  });
});
