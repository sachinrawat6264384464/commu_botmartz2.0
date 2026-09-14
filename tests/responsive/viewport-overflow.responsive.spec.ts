import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { width: 320, height: 640 },
  { width: 360, height: 740 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
  { width: 430, height: 932 },
  { width: 600, height: 960 },
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 834, height: 1194 },
  { width: 1024, height: 1366 },
  { width: 1280, height: 800 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 },
  { width: 1728, height: 1117 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
];

const PAGES_TO_TEST = ['/', '/login', '/arena', '/community/events', '/certificates'];

test.describe('18-Viewport Zero Horizontal Overflow Audit', () => {

  for (const vp of VIEWPORTS) {
    for (const pagePath of PAGES_TO_TEST) {
      test(`No Overflow at ${vp.width}x${vp.height} on ${pagePath}`, async ({ page }) => {
        await page.setViewportSize(vp);
        await page.goto(`http://localhost:3001${pagePath}`);
        await page.waitForLoadState('domcontentloaded');

        // Assert scrollWidth <= clientWidth to guarantee zero horizontal overflow
        const overflowCheck = await page.evaluate(() => {
          const documentWidth = document.documentElement.clientWidth;
          const scrollWidth = document.documentElement.scrollWidth;
          const bodyScrollWidth = document.body.scrollWidth;
          return {
            clientWidth: documentWidth,
            scrollWidth: Math.max(scrollWidth, bodyScrollWidth),
            hasOverflow: Math.max(scrollWidth, bodyScrollWidth) > documentWidth + 1
          };
        });

        expect(overflowCheck.hasOverflow).toBe(false);
      });
    }
  }

});
