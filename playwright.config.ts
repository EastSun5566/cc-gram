import { defineConfig, devices } from '@playwright/test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const port = 4173;
const baseURL = `http://127.0.0.1:${port}/cc-gram/`;

export default defineConfig({
  testDir: './e2e',
  outputDir: process.env.CI
    ? 'test-results'
    : join(tmpdir(), 'cc-gram-playwright-test-results'),
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `pnpm -C demo dev --host 127.0.0.1 --port ${port} --strictPort`,
    url: `${baseURL}e2e.html`,
    reuseExistingServer: false,
  },
});
