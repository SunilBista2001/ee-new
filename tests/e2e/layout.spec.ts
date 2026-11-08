import { expect, test } from '@playwright/test';

test.describe('responsive layout', () => {
  test('has no horizontal overflow', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    // The page must not scroll sideways either (wheel/trackpad on desktop, swipe on touch).
    await page.mouse.wheel(500, 0);
    expect(await page.evaluate(() => window.scrollX)).toBe(0);
  });

  test('renders every section in the server HTML', async ({ request }) => {
    const html = await (await request.get('/')).text();
    for (const text of [
      'Where entrepreneurs',
      'Partners of the 2026 summit',
      'Business grows better together.',
      'Look Forward to',
      'The next room is being curated.',
      'Elite Entrepreneurs Toronto Summit',
      'Omni King Edward Hotel',
      'Learn from people who build.',
      'Parikchhit',
      'Every connection has a story.',
      'Creo Social',
      'starts here.',
      'Stay connected.',
      'pb@mintaveinc.com',
    ]) {
      expect(html, text).toContain(text);
    }
  });
});
