import { expect, test } from '@playwright/test';

const isCollapsed = (width: number) => width <= 991;

test.describe('navigation', () => {
  test('menu and "More" dropdown work with mouse and keyboard', async ({ page, viewport }) => {
    await page.goto('/');
    const banner = page.getByRole('banner');
    const more = banner.getByRole('button', { name: 'More' });

    if (isCollapsed(viewport?.width ?? 0)) {
      const toggle = banner.getByRole('button', { name: 'Open menu' });
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await toggle.click();
      await expect(banner.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
      await expect(banner.getByRole('link', { name: 'Events' })).toBeVisible();
      await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

      await more.click();
      await expect(more).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#nav-more-panel')).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(banner.getByRole('button', { name: 'Open menu' })).toBeFocused();
      await expect(banner.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
    } else {
      await expect(banner.getByRole('link', { name: 'Events' })).toBeVisible();
      await more.focus();
      await page.keyboard.press('Enter');
      await expect(more).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#nav-more-panel')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(more).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('#nav-more-panel')).toBeHidden();
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
