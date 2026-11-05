import { defineConfig, devices } from '@playwright/test';
import { VIEWPORTS } from './tests/viewports';

/**
 * TARGET=reference → the frozen React build (scripts/serve-reference.mjs, port 5173)
 * TARGET=next      → the Next.js production server (port 3000, default)
 */
const TARGET = process.env.TARGET === 'reference' ? 'reference' : 'next';
const PORT = TARGET === 'reference' ? 5173 : 3000;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  snapshotPathTemplate: '{testDir}/visual/__baseline__/{projectName}/{arg}{ext}',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      threshold: 0.2,
      maxDiffPixelRatio: 0.001,
    },
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    ...VIEWPORTS.map((vp) => ({
      name: `visual-${vp.name}`,
      testMatch: /visual\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: vp.width, height: vp.height } },
    })),
    ...VIEWPORTS.map((vp) => ({
      name: `e2e-${vp.name}`,
      testMatch: /e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: vp.width, height: vp.height } },
    })),
  ],
  webServer:
    TARGET === 'reference'
      ? { command: 'node scripts/serve-reference.mjs 5173', port: 5173, reuseExistingServer: true }
      : { command: 'npm run start -- --port 3000', port: 3000, reuseExistingServer: true, timeout: 120_000 },
});
