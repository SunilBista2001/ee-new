import { expect, test } from '@playwright/test';

const isCollapsed = (width: number) => width <= 991;

test.describe('navigation', () => {
  test('primary links point at sections that exist on the page', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page
      .locator('a[href^="#"]')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of new Set(hrefs)) {
      if (href === '#top' || href === '#main-content') continue;
      await expect(page.locator(href), href).toHaveCount(1);
    }
  });

  test('desktop links or the fullscreen menu work with mouse and keyboard', async ({ page, viewport }) => {
    await page.goto('/');
    const banner = page.getByRole('banner');

    if (isCollapsed(viewport?.width ?? 0)) {
      const toggle = banner.getByRole('button', { name: 'Open menu' });
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await toggle.click();
      await expect(banner.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
      const dialog = page.getByRole('dialog', { name: 'Menu' });
      await expect(dialog.getByRole('link', { name: /Podcast/ })).toBeVisible();
      await expect(dialog.getByRole('link', { name: /Events/ }).first()).toBeFocused();
      await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

      await page.keyboard.press('Escape');
      await expect(banner.getByRole('button', { name: 'Open menu' })).toBeFocused();
      await expect(banner.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');

      // Choosing a link closes the menu and opens the page.
      await banner.getByRole('button', { name: 'Open menu' }).click();
      await dialog.getByRole('link', { name: /Podcast/ }).click();
      await expect(page).toHaveURL(/\/podcast$/);
      await expect(page.getByRole('heading', { level: 1, name: 'Coming soon' })).toBeAttached();
    } else {
      const nav = page.getByRole('navigation', { name: 'Primary' });
      await expect(nav.getByRole('link', { name: /Events/ })).toBeVisible();
      await nav.getByRole('link', { name: /Podcast/ }).click();
      await expect(page).toHaveURL(/\/podcast$/);
      await expect(page.getByRole('heading', { level: 1, name: 'Coming soon' })).toBeAttached();
    }
  });

  test('skip link moves focus to the main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });
});
