import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const ENDPOINT = '**/api/podcast-notify';

test.describe('podcast page', () => {
  test('renders the announcement in order in the server HTML', async ({ request }) => {
    const page = await (await request.get('/podcast')).text();
    // Page content only: the head repeats some of these phrases in its metadata.
    const html = page.slice(page.indexOf('<main'));
    const markers = [
      'Keeping It Real',
      'Coming soon',
      'Stay tuned.',
      'Behind the scenes',
      'Something worth listening to',
    ];
    const positions = markers.map((marker) => html.indexOf(marker));
    positions.forEach((pos, i) => expect(pos, markers[i]).toBeGreaterThan(-1));
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  test('pre-launch: no episodes, players, audio or countdowns', async ({ page }) => {
    await page.goto('/podcast');
    // The visual letters are aria-hidden; the heading's accessible name is the plain phrase.
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Coming soon');
    await expect(page.locator('#episodes')).toHaveCount(0);
    await expect(page.locator('audio, video')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /play|pause/i })).toHaveCount(0);
    // No platform is configured yet, so no "Listen on" row.
    await expect(page.getByRole('navigation', { name: 'Listen on' })).toHaveCount(0);
  });

  test('marks Podcast as the current page and the hero button reaches the sign-up', async ({ page }) => {
    await page.goto('/podcast');
    await expect(page.locator('.nav__links a[aria-current="page"]')).toHaveText('Podcast');
    await page.locator('.pc-hero').getByRole('link', { name: 'Keep me posted' }).click();
    await expect(page.locator('#stay-tuned')).toBeInViewport();
  });

  test('follow links are the verified profiles only', async ({ page }) => {
    await page.goto('/podcast');
    const hrefs = await page
      .getByRole('navigation', { name: 'Follow along' })
      .getByRole('link')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    expect(hrefs).toEqual([
      'https://luma.com/eliteentrepreneur',
      'https://www.instagram.com/lifeofsplash/',
      'https://www.linkedin.com/in/parikchhit-basnet/',
    ]);
  });

  test('sign-up validates the address before sending', async ({ page }) => {
    let calls = 0;
    await page.route(ENDPOINT, (route) => {
      calls++;
      return route.fulfill({ status: 200, json: { ok: true } });
    });
    await page.goto('/podcast');
    const form = page.locator('#stay-tuned form');
    await form.getByRole('button', { name: 'Keep me posted' }).click();
    await expect(form.getByText('Please enter a valid email address.')).toBeVisible();
    await form.getByLabel('Email address').fill('not-an-email');
    await form.getByRole('button', { name: 'Keep me posted' }).click();
    await expect(form.getByLabel('Email address')).toHaveAttribute('aria-invalid', 'true');
    expect(calls).toBe(0);
  });

  test('sign-up shows success only after the server accepts it, and sends once', async ({ page }) => {
    const bodies: unknown[] = [];
    await page.route(ENDPOINT, async (route) => {
      bodies.push(route.request().postDataJSON());
      await new Promise((resolve) => setTimeout(resolve, 300));
      return route.fulfill({ status: 200, json: { ok: true } });
    });
    await page.goto('/podcast');
    const form = page.locator('#stay-tuned form');
    await form.getByLabel('Email address').fill('Founder@Example.com');
    const submit = form.getByRole('button', { name: 'Keep me posted' });
    await submit.click();
    await expect(form.getByRole('button', { name: 'Sending' })).toBeDisabled();
    await expect(page.locator('#stay-tuned').getByRole('status')).toContainText('You’re on the list.');
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toMatchObject({ email: 'founder@example.com' });
  });

  test('sign-up reports an unconfigured destination as an error, not a success', async ({ page }) => {
    await page.route(ENDPOINT, (route) => route.fulfill({ status: 503, json: { ok: false, error: 'unavailable' } }));
    await page.goto('/podcast');
    const form = page.locator('#stay-tuned form');
    await form.getByLabel('Email address').fill('founder@example.com');
    await form.getByRole('button', { name: 'Keep me posted' }).click();
    await expect(form.getByRole('alert')).toHaveText('Launch sign-ups are not open just yet. Please check back soon.');
    await expect(page.locator('#stay-tuned').getByRole('status')).toHaveCount(0);
    await expect(form.getByRole('button', { name: 'Keep me posted' })).toBeEnabled();
  });

  test('the API refuses malformed and cross-site requests', async ({ request }) => {
    const bad = await request.post('/api/podcast-notify', { data: { email: 'nope' } });
    expect(bad.status()).toBe(422);
    const cross = await request.post('/api/podcast-notify', {
      data: { email: 'a@b.co', submissionId: crypto.randomUUID() },
      headers: { Origin: 'https://example.org' },
    });
    expect(cross.status()).toBe(403);
  });

  test('no horizontal overflow', async ({ page }) => {
    await page.goto('/podcast');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('no WCAG 2.2 A/AA violations (axe)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' }); // all content in its final, visible state
    await page.goto('/podcast');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const summary = results.violations.map(
      (v) => `${v.id} (${v.impact}): ${v.help} → ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
    );
    expect(summary).toEqual([]);
  });
});
