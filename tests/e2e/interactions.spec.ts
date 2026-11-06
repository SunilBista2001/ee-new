import { expect, test } from '@playwright/test';

test.describe('homepage interactions', () => {
  test('community stories move with buttons, avatars and arrow keys', async ({ page }) => {
    await page.goto('/');
    const carousel = page.getByRole('region', { name: 'Community stories' });
    const quote = carousel.locator('blockquote');
    await expect(quote).toContainText('favourite events');
    await expect(carousel.locator('.story__name')).toHaveText('Steven');

    await carousel.getByRole('button', { name: 'Next story' }).click();
    await expect(carousel.locator('.story__name')).toHaveText('Tarun');
    await carousel.getByRole('button', { name: 'Previous story' }).click();
    await expect(carousel.locator('.story__name')).toHaveText('Steven');

    await carousel.getByRole('button', { name: 'Previous story' }).focus();
    await page.keyboard.press('ArrowLeft');
    await expect(carousel.locator('.story__name')).toHaveText('Umar');

    const pick = carousel.getByRole('button', { name: 'Show story from Dylan Blyuss' });
    await pick.click();
    await expect(carousel.locator('.story__name')).toHaveText('Dylan Blyuss');
    await expect(pick).toHaveAttribute('aria-current', 'true');
  });

  test('newsletter form validates and confirms', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('#newsletter');
    const email = form.getByLabel('Email address');
    await email.fill('not-an-email');
    await form.getByRole('button', { name: 'Subscribe' }).click();
    await expect(form.getByRole('alert')).toHaveText('Please enter a valid email address.');
    await expect(email).toHaveAttribute('aria-invalid', 'true');

    await email.fill('member@example.com');
    await form.getByRole('button', { name: 'Subscribe' }).click();
    await expect(form.getByRole('status')).toContainText('You’re on the list.');
  });

  test('reduced motion shows content without animating', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce', baseURL });
    const page = await context.newPage();
    await page.goto('/');
    // Never scrolled into view, yet already in its final state.
    await expect(page.locator('[data-reveal="fade"]').last()).toHaveCSS('opacity', '1');
    await expect(page.locator('[data-reveal="clip"]').last()).toHaveCSS('clip-path', 'none');
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
