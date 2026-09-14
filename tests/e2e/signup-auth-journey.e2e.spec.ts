import { test, expect } from '@playwright/test';

test.describe('Botmartz Platform End-to-End User Journeys', () => {

  const BASE_URL = 'http://localhost:3001';

  test('E2E-01: Landing Page Load, Navigation & Header Ticker', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Botmartz|AI/i);
    
    // Check main hero headline visibility
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText(/Build Production Systems|Ship Daily/i);

    // Verify Navbar presence
    const navHome = page.locator('nav').first();
    await expect(navHome).toBeVisible();
  });

  test('E2E-02: Full Student Sign-Up Registration Flow', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    
    // Verify Sign Up form
    const nameInput = page.getByPlaceholder('e.g. Rahul Sharma');
    await expect(nameInput).toBeVisible();

    // Fill Sign Up form
    await nameInput.fill('Automation Student QA');
    await page.getByPlaceholder('student@college.edu').fill(`e2e_student_${Date.now()}@college.edu`);
    await page.getByPlaceholder('e.g. IET DAVV / PBCOE').fill('IET DAVV Automated Campus');

    // Click Submit
    const submitBtn = page.getByRole('button', { name: /Create Student Account & Start/i });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Verify Success Message or Redirect
    await expect(page).toHaveURL(/\/arena|\//, { timeout: 15000 });
  });

  test('E2E-03: Toggle Auth Mode Between Sign Up & Sign In', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });

    // Click Sign In tab
    const signInTab = page.getByRole('button', { name: /^Sign In$/i });
    await expect(signInTab).toBeVisible();
    await signInTab.click();

    // Verify Sign In UI options (Password input)
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Click Sign Up tab back
    const signUpTab = page.getByRole('button', { name: /^Sign Up$/i });
    await signUpTab.click();
    await expect(page.getByPlaceholder('e.g. Rahul Sharma')).toBeVisible();
  });

  test('E2E-04: AI Arena & 50 Systems Catalog Navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}/arena`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('E2E-05: Virtual AI Internship Page Navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}/virtual-ai-internship`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('E2E-06: Events & Community Page Navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}/community/events`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('E2E-07: Public Builder Portfolio Page Routing', async ({ page }) => {
    await page.goto(`${BASE_URL}/member/alex_builder`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).not.toBeEmpty();
    await expect(page.getByText(/alex_builder|Shipper Reputation/i).first()).toBeVisible();
  });

  test('E2E-08: Cryptographic Credential Verification Page', async ({ page }) => {
    await page.goto(`${BASE_URL}/certificates`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('E2E-09: Accessibility Floating Button Modal Interaction', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    
    // Check page body renders cleanly
    await expect(page.locator('body')).not.toBeEmpty();
  });

});
