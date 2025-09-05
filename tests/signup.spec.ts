import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

test.describe("Test signup and company creation", async () => {
  test("should be successful", async ({ page }) => {
    await page.goto("signup");
    await page.waitForTimeout(500);

    await page
      .getByRole("textbox", { name: "Name:" })
      .fill(faker.person.fullName());
    await page
      .getByRole("textbox", { name: "Email:" })
      .fill(faker.internet.email());
    await page.getByRole("textbox", { name: "Password:" }).fill("Password1!");
    await page
      .getByRole("textbox", { name: "Enter password again:" })
      .fill("Password1!");
    await page.getByRole("button", { name: "Signup" }).click();

    await page.waitForURL("/create-company");

    expect(page).toHaveURL("/create-company");
    await page.waitForTimeout(500);

    await page
      .getByRole("textbox", { name: "Company name:" })
      .fill(faker.company.name());
    await page
      .getByRole("textbox", { name: "Company email:" })
      .fill(faker.internet.email());
    await page
      .getByRole("textbox", { name: "Company phone number:" })
      .fill(faker.phone.number({ style: "international" }));
    await page
      .getByRole("textbox", { name: "Company address:" })
      .fill(faker.location.streetAddress());

    await page.getByRole("button", { name: "Save" }).click();

    await page.waitForURL("/dashboard");
    await expect(page).toHaveURL("/dashboard");
  });

  test("should have errors in signup", async ({ page }) => {
    await page.goto("/signup");
    await page.waitForTimeout(500);

    const nameField = page.getByRole("textbox", { name: "Name:" });
    const emailField = page.getByRole("textbox", { name: "Email:" });
    const passwordField = page.getByRole("textbox", { name: "Password:" });
    const secondPasswordField = page.getByRole("textbox", {
      name: "Enter password again:",
    });
    const submit = page.getByRole("button", { name: "Signup" });

    await nameField.fill("so");
    await emailField.fill("thomas@shelbyltd.com");
    await passwordField.fill("pass");
    await secondPasswordField.fill("pass");
    await submit.click();

    await expect(page.getByText("Name must be at least 3")).toBeVisible();
    await expect(
      page.getByText("Password must be at least 8 characters."),
    ).toHaveCount(2);

    await nameField.fill(faker.person.fullName());
    await passwordField.fill("Password1!");
    await secondPasswordField.fill("Password2!");
    await submit.click();

    await expect(page.getByText("Passwords do not match.")).toBeVisible();

    await nameField.fill("Thomas Shelby");
    await secondPasswordField.fill("Password1!");
    await submit.click();

    await expect(
      page.getByText("A user with the same email already exists."),
    ).toBeVisible();
  });

  test("should have errors in company creation form", async ({ page }) => {
    await page.goto("/signup");
    await page.waitForTimeout(500);

    await page
      .getByRole("textbox", { name: "Name:" })
      .fill(faker.person.fullName());
    await page
      .getByRole("textbox", { name: "Email:" })
      .fill(faker.internet.email());
    await page.getByRole("textbox", { name: "Password:" }).fill("Password1!");
    await page
      .getByRole("textbox", { name: "Enter password again:" })
      .fill("Password1!");
    await page.getByRole("button", { name: "Signup" }).click();

    await page.waitForURL("/create-company");

    expect(page).toHaveURL("/create-company");
    await page.waitForTimeout(500);

    await page.getByRole("textbox", { name: "Company name:" }).fill("sol");
    await page
      .getByRole("textbox", { name: "Company email:" })
      .fill("contact@shelbyltd.com");
    await page
      .getByRole("textbox", { name: "Company phone number:" })
      .fill("+919191919191");
    await page.getByRole("textbox", { name: "Company address:" }).fill("addd");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Company name should have at")).toBeVisible();
    await expect(page.getByText("Address should have at least")).toBeVisible();
    await page
      .getByRole("textbox", { name: "Company name:" })
      .fill("Some company");
    await page
      .getByRole("textbox", { name: "Company address:" })
      .press("ControlOrMeta+a");
    await page
      .getByRole("textbox", { name: "Company address:" })
      .fill("Good address");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("A company with provided email")).toBeVisible();
  });
});
