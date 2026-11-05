import { expect, test } from '@playwright/test';
import { SECTIONS } from './sections';
import { loadSettled } from './stabilize';

/**
 * Pixel comparison against the approved React build.
 *   1. npm run test:visual:baseline   (TARGET=reference: screenshots of the React build)
 *   2. npm run test:visual            (TARGET=next: compares the Next.js build)
 *
 * The page is loaded and settled once per viewport; every comparison is a soft assertion
 * so one run reports every mismatching region.
 */
test('homepage matches the approved React build', async ({ page }) => {
  test.setTimeout(180_000);
  await loadSettled(page);
  // Animated GIFs play on the real clock, so their current frame is not deterministic.
  // The files are identical in both builds; mask them so only layout and styling are compared.
  const mask = [page.locator('img[src$=".gif"]')];

  await expect.soft(page, 'full page').toHaveScreenshot('full-page.png', { fullPage: true, mask });

  for (const section of SECTIONS) {
    const region = page.locator(section.selector).first();
    await expect.soft(region, section.name).toHaveScreenshot(`section-${section.name}.png`, { mask });
  }

  // Interaction state: a city without events shows "Check Back Soon".
  const toggle = page.locator('.tab-dropdown');
  if (await toggle.isVisible()) await toggle.click();
  await page.locator('#event-tabs').getByText('Montreal', { exact: true }).click();
  await page.clock.runFor(2_000);
  await expect
    .soft(page.locator('.section_cta25:not(.bg-radial-gradient)'), 'events empty state')
    .toHaveScreenshot('events-empty-state.png', { mask });
});
