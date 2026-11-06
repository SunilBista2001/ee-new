import { expect, test } from '@playwright/test';

test.describe('SEO', () => {
  test('homepage metadata', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Elite Entrepreneurs | Where Entrepreneurs Come Together to Grow');
    const meta = (selector: string) => page.locator(selector).getAttribute('content');
    expect(await meta('meta[name="description"]')).toMatch(/^Summits, founder networking, roundtables/);
    // Absolute URL of the site root (Next.js omits the trailing slash on the origin).
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(/^https?:\/\/[^/]+\/?$/);
    expect(await meta('meta[property="og:title"]')).toBe(
      'Elite Entrepreneurs | Where Entrepreneurs Come Together to Grow',
    );
    expect(await meta('meta[property="og:type"]')).toBe('website');
    expect(await meta('meta[name="twitter:card"]')).toBeTruthy();
    expect(await page.locator('html').getAttribute('lang')).toBe('en-CA');
  });

  test('one h1 and alt text on every image', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const missingAlt = await page.locator('img:not([alt])').count();
    expect(missingAlt).toBe(0);
  });

  test('structured data is valid JSON', async ({ page }) => {
    await page.goto('/');
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks) expect(() => JSON.parse(block)).not.toThrow();
  });

  test('robots.txt and sitemap.xml respond', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBe(true);
    expect(await robots.text()).toContain('User-Agent: *');
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain('<urlset');
  });
});
