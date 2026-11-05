import type { Page } from '@playwright/test';

/** Fixed start time so every run (and both implementations) see the same animation clock. */
const START = new Date('2026-11-05T12:00:00Z');

/**
 * Loads `path` with a paused fake clock, scrolls the whole page so every scroll-triggered
 * reveal fires, lets all GSAP tweens finish, then returns to the top. Because the clock only
 * advances when we tell it to, the infinite image "bounce" ends at the same phase every run.
 */
export async function loadSettled(page: Page, path = '/'): Promise<void> {
  await page.clock.install({ time: START });
  await page.clock.pauseAt(START);
  await page.goto(path, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.clock.runFor(2_000);

  const step = await page.evaluate(() => Math.max(200, Math.floor(window.innerHeight * 0.5)));
  for (let y = 0; ; y += step) {
    const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    await page.evaluate((top) => window.scrollTo(0, top), Math.min(y, max));
    await page.waitForTimeout(30); // IntersectionObserver callbacks run on real time
    await page.clock.runFor(600);
    if (y >= max) break;
  }
  await page.clock.runFor(3_000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(30);
  // Run the nav-pill smoothing back to its top-of-page state and settle the bounce to a fixed phase.
  await page.clock.runFor(4_000);
  await page.evaluate(() => document.fonts.ready);
}
