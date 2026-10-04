import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: { baseURL: 'http://127.0.0.1:3000', reducedMotion: 'reduce' },
  webServer: { command: 'GAUNTLET_E2E=1 npm run dev', url: 'http://127.0.0.1:3000', reuseExistingServer: false },
});
