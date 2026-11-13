import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('events page', () => {
  test('renders the sections in order in the server HTML', async ({ request }) => {
    const html = await (await request.get('/events')).text();
    const markers = [
      'We host the events people actually want to',
      'And keep coming back to.',
      'One table. Fifteen people. One long dinner.',
      'By application.',
      'Something different every month.',
      'Founders Padel',
      'Coming up.',
    ];
    const positions = markers.map((marker) => html.indexOf(marker));
    positions.forEach((pos, i) => expect(pos, markers[i]).toBeGreaterThan(-1));
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  test('hero button scrolls to the calendar', async ({ page }) => {
    await page.goto('/events');
    await page.getByRole('link', { name: 'See the calendar' }).click();
    await expect(page.locator('#calendar')).toBeInViewport();
  });

  test('anchors from the homepage ecosystem resolve', async ({ page }) => {
    await page.goto('/events');
    await expect(page.locator('#the-fifteen')).toHaveCount(1);
    await expect(page.locator('#sidequests')).toHaveCount(1);
  });

  test('the date of the first Sidequest stays a marked placeholder', async ({ page }) => {
    await page.goto('/events');
    await expect(page.locator('#sidequests .slot-text')).toHaveText('[date]');
  });

  test('marks Events as the current page in the navigation', async ({ page }) => {
    await page.goto('/events');
    await expect(page.locator('.nav__links a[aria-current="page"]')).toHaveText('Events');
  });

  test('no WCAG 2.2 A/AA violations (axe)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' }); // all content in its final, visible state
    await page.goto('/events');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const summary = results.violations.map(
      (v) => `${v.id} (${v.impact}): ${v.help} → ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
    );
    expect(summary).toEqual([]);
  });
});
