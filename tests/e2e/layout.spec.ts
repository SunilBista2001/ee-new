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
      'Relationships drive',
      '1,000+',
      'At our last summit',
      'Business got loud.',
      'So people work with people they know.',
      'Who you’ll meet.',
      'Anyone only there to pitch.',
      'One idea. A lot of rooms.',
      'The Fifteen',
      'Coming up.',
      'luma.com',
      'What it feels like.',
      'Eddie Malouf',
      'Keeping It Real.',
      'Put your brand in the rooms where business actually happens.',
      'Join the list',
      'pb@mintaveinc.com',
    ]) {
      expect(html, text).toContain(text);
    }
  });
});
