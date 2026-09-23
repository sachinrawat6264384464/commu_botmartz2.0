import { test, expect } from "@playwright/test";

test.describe("Login Form Automated Test Suite (TC_LOGIN)", () => {
  const BASE_URL = "http://localhost:3001";

  test("TC_LOGIN_002: Verify login form is displayed", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });

    // Verify login form is visible
    const loginForm = page.locator("#login-form, form").first();
    await expect(loginForm).toBeVisible();

    // Verify email input is visible
    const emailInput = page.locator('input[type="email"], #email-input').first();
    await expect(emailInput).toBeVisible();
  });

  test("TC_LOGIN_003: Verify Sign In button displayed", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });

    // Verify Sign In submit button is displayed
    const signInBtn = page.locator("#signin-btn, button:has-text('Sign In')").first();
    await expect(signInBtn).toBeVisible();
  });

  test("TC_LOGIN_004: Empty login submission", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });

    // Click Sign In button without entering credentials
    const signInBtn = page.locator("#signin-btn").first();
    await expect(signInBtn).toBeVisible();
    await signInBtn.click();

    // Verify error message is rendered
    const errorMessage = page.locator("#login-error-msg, [data-testid='login-error-msg']").first();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/Please enter your/i);
  });
});
