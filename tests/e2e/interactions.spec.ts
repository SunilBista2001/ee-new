import { expect, test } from '@playwright/test';

test.describe('homepage interactions', () => {
  test('testimonials switch with the people list and arrow keys', async ({ page }) => {
    await page.goto('/');
    const stage = page.getByRole('region', { name: 'Testimonials' });
    const name = stage.locator('.tst__name');
    await expect(name).toHaveText('Eddie Malouf');

    const second = stage.getByRole('button', { name: 'Brandon Carter' });
    await second.click();
    await expect(name).toHaveText('Brandon Carter');
    await expect(second).toHaveAttribute('aria-current', 'true');

    await page.keyboard.press('ArrowUp');
    await expect(name).toHaveText('Eddie Malouf');
    await page.keyboard.press('ArrowUp');
    await expect(stage.getByRole('button', { name: '[Name]' })).toBeFocused();
  });

  test('ecosystem rows link to their sections on the Events page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'The Summit' })).toHaveAttribute('href', '/events#summit');
    await expect(page.getByRole('link', { name: 'Sidequests' })).toHaveAttribute('href', '/events#sidequests');
  });

  test('newsletter form validates and confirms', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('#newsletter');
    const email = form.getByLabel('Email address');
    await email.fill('not-an-email');
    await form.getByRole('button', { name: 'Join the list' }).click();
    await expect(form.getByRole('alert')).toHaveText('Please enter a valid email address.');
    await expect(email).toHaveAttribute('aria-invalid', 'true');

    await email.fill('member@example.com');
    await form.getByRole('button', { name: 'Join the list' }).click();
    await expect(form.getByRole('status')).toContainText('You’re on the list.');
  });

  test('reduced motion shows content without animating', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce', baseURL });
    const page = await context.newPage();
    await page.goto('/');
    // Never scrolled into view, yet already in its final state.
    await expect(page.locator('[data-reveal="fade"]').last()).toHaveCSS('opacity', '1');
    await expect(page.locator('[data-reveal="mask"]').last()).toHaveCSS('clip-path', 'none');
    await expect(page.locator('[data-count]').nth(1)).toHaveText('1,000+');
    await expect(page.locator('[data-hero-title]')).toHaveCSS('opacity', '1');
    await context.close();
  });

  test('content is visible without JavaScript', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('[data-reveal="fade"]').first()).toHaveCSS('opacity', '1');
    await context.close();
  });
});
