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
      'Tech Community',
      'Trusted by Members who Built',
      'Future of Education: Impact of AI on Learning',
      'Learn from',
      'Impact Stories',
      'Other Ways Members Benefit',
      'Join 70,000+',
      'Exclusive Sponsorships',
    ]) {
      expect(html, text).toContain(text);
    }
  });
});
