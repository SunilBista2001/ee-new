import { expect, test } from '@playwright/test';

test.describe('homepage interactions', () => {
  test('city filter shows the empty state for cities without events', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('.section_cta25:not(.bg-radial-gradient)');
    const toggle = section.getByRole('button', { name: 'Select City' });
    if (await toggle.isVisible()) {
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    }
    await expect(section.getByRole('radio', { name: 'Toronto' })).toBeChecked();
    await expect(section.getByRole('listitem')).toHaveCount(1);
    await expect(section.getByRole('listitem')).toBeVisible();

    await section.getByText('Montreal', { exact: true }).click();
    await expect(section.getByRole('radio', { name: 'Montreal' })).toBeChecked();
    await expect(section.getByRole('listitem')).toBeHidden();
    await expect(section.getByRole('heading', { name: /Check Back/ })).toBeVisible();
  });

  test('testimonial tabs follow the ARIA tabs pattern', async ({ page }) => {
    await page.goto('/');
    const tabs = page.getByRole('tablist', { name: 'Impact Stories' }).getByRole('tab');
    await expect(tabs).toHaveCount(3);
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('Braden Ream');

    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('Mike Katchen');

    await tabs.nth(1).focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(2)).toBeFocused();
    await expect(page.getByRole('tabpanel')).toContainText('Satish Kanwar');
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
    await expect(form.getByText('Thank You for subscribing!')).toBeVisible();
  });

  test('reduced motion shows content without animating', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce', baseURL });
    const page = await context.newPage();
    await page.goto('/');
    const lastReveal = page.locator('[data-w-id="06b22815-caf7-f09c-b229-a0b60d155446"] [data-w-id]').last();
    // Never scrolled into view, yet already in its final state.
    await expect(lastReveal).toHaveCSS('opacity', '1');
    await expect(page.locator('.img-highlight').first()).toHaveCSS('transform', /matrix\(0, 0, 0, 1/);
    await context.close();
  });
});
