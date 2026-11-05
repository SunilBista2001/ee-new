import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('accessibility', () => {
  test('no WCAG 2.2 A/AA violations (axe)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' }); // all content in its final, visible state
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} × ${v.help}`);
    expect(summary).toEqual([]);
  });
});
