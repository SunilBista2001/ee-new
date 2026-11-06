import { defineConfig, devices } from '@playwright/test';
import { VIEWPORTS } from './tests/viewports';

/** End-to-end tests run against the Next.js production server (npm run build first). */
const PORT = 3000;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    ...VIEWPORTS.map((vp) => ({
      name: `e2e-${vp.name}`,
      testMatch: /e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: vp.width, height: vp.height } },
    })),
  ],
  webServer: { command: 'npm run start -- --port 3000', port: PORT, reuseExistingServer: true, timeout: 120_000 },
});
