import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/** Fills every required field of the partnership inquiry form with test values. */
async function fillInquiry(page: Page) {
  const form = page.locator('#inquiry form');
  await form.getByLabel('Name').fill('Test Person');
  await form.getByLabel('Company').fill('Test Co');
  await form.getByLabel('Role').fill('Head of Growth');
  await form.getByLabel('Work email').fill('test@example.test');
  await form.getByLabel('What do you want to achieve?').fill('An automated test submission.');
  await form.getByRole('radio', { name: '$10K to $25K' }).check();
  await form.getByRole('checkbox', { name: 'The Summit' }).check();
  return form;
}

test.describe('partners page', () => {
  test('renders the nine sections in order in the server HTML', async ({ request }) => {
    const html = await (await request.get('/partners')).text();
    const markers = [
      'Partner with the network',
      'Who’s in the room.',
      'Founders running 7 to 9 figure businesses.',
      'Business moves faster when people trust each other.',
      'What partners get.',
      'Ways to work together.',
      'Hire us to host your event',
      'Splash',
      'Growth Writer',
      'Partner stories.',
      'Past partners.',
      'Start the conversation.',
    ];
    let last = -1;
    for (const marker of markers) {
      const at = html.indexOf(marker, last + 1);
      expect(at, marker).toBeGreaterThan(last);
      last = at;
    }
  });

  test('metadata, one h1, no horizontal overflow', async ({ page }) => {
    await page.goto('/partners');
    await expect(page).toHaveTitle('Partner with Elite Entrepreneurs');
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(/\/partners$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('shared navigation leads back to homepage sections', async ({ page }) => {
    await page.goto('/partners');
    const hrefs = await page.locator('.nav__links a').evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    expect(hrefs).toEqual(['/#events', '/partners', '/#about', '/#podcast']);
    await expect(page.locator('.nav__links a[aria-current="page"]')).toHaveText('Partners');
    await expect(page.locator('.nav__cta')).toHaveAttribute('href', '/#events');
  });

  test('partner stories switch with the keyboard and show the empty state', async ({ page }) => {
    await page.goto('/partners');
    const tabs = page.getByRole('tablist', { name: 'Partners' }).getByRole('tab');
    await expect(tabs).toHaveCount(5);
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('Story in progress.');
  });

  test('inquiry form validates required fields', async ({ page }) => {
    await page.goto('/partners');
    await page.locator('#inquiry').getByRole('button', { name: 'Send inquiry' }).click();
    await expect(page.locator('#inquiry .fm-error')).toHaveCount(6);
    await expect(page.locator('#inquiry form').getByLabel('Name')).toBeFocused();
  });

  test('inquiry form shows the confirmation only after the server accepts it', async ({ page }) => {
    let calls = 0;
    await page.route('**/api/partner-inquiry', async (route) => {
      calls += 1;
      await new Promise((r) => setTimeout(r, 300));
      await route.fulfill({ status: 200, json: { ok: true } });
    });
    await page.goto('/partners');
    const form = await fillInquiry(page);
    const submit = form.getByRole('button', { name: 'Send inquiry' });
    await submit.click();
    await expect(form.getByRole('button', { name: 'Sending…' })).toBeDisabled();
    await expect(page.locator('#inquiry').getByRole('status')).toContainText('Thanks. We’ll be in touch within');
    expect(calls).toBe(1);
  });

  test('inquiry form reports a delivery failure instead of succeeding', async ({ page }) => {
    await page.route('**/api/partner-inquiry', (route) =>
      route.fulfill({ status: 503, json: { ok: false, error: 'unavailable' } }),
    );
    await page.goto('/partners');
    const form = await fillInquiry(page);
    await form.getByRole('button', { name: 'Send inquiry' }).click();
    const inquiry = page.locator('#inquiry');
    await expect(inquiry.getByRole('alert')).toContainText('not accepting submissions');
    await expect(inquiry.getByRole('status')).toHaveCount(0);
  });

  test('no WCAG 2.2 A/AA violations (axe)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/partners');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const summary = results.violations.map(
      (v) => `${v.id} (${v.impact}): ${v.help} → ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
    );
    expect(summary).toEqual([]);
  });
});

test.describe('partner inquiry API', () => {
  test('rejects invalid and automated submissions', async ({ request }) => {
    const invalid = await request.post('/api/partner-inquiry', { data: { name: 'x' } });
    expect(invalid.status()).toBe(422);
    const honeypot = await request.post('/api/partner-inquiry', {
      data: {
        name: 'Bot',
        company: 'Bot Co',
        role: 'Bot',
        email: 'bot@example.test',
        goals: 'Automated submission text',
        budget: '5k-10k',
        events: [],
        submissionId: '00000000-0000-4000-8000-000000000000',
        website: 'https://spam.example',
      },
    });
    expect(honeypot.status()).toBe(422);
  });
});
