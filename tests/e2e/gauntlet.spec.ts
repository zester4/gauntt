import { test, expect } from '@playwright/test';

test('task lab exposes distinct form contracts', async ({ page }) => {
  await page.goto('/tasks');
  await expect(page.getByRole('heading', { name: 'Every surface asks a different question.' })).toBeVisible();
  await page.getByRole('button', { name: /07 Submit an expense report/ }).click();
  await expect(page.getByRole('heading', { name: 'Submit an expense report' })).toBeVisible();
  await expect(page.getByText('March travel expenses')).toBeVisible();
  await page.getByRole('button', { name: /Search for a flight/ }).click();
  await expect(page.getByLabel('From')).toBeVisible();
});

test('worlds expose distinct application surfaces', async ({ page }) => {
  for (const [world, marker] of [['northwind','Available balance'], ['wanderly','Search flights'], ['helix','Live seeded workspace'], ['caredesk','Ticket queue'], ['civic','Housing support application']] as const) {
    await page.goto(`/worlds/${world}`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(marker, { exact: false }).first()).toBeVisible();
  }
});

test('task verifier rejects missing state and reset endpoint responds', async ({ request }) => {
  const verify = await request.post('/api/tasks/FORM-10/verify', { data: { state: {} } });
  expect(verify.status()).toBe(422);
  const reset = await request.post('/api/worlds/northwind/reset');
  expect(reset.ok()).toBeTruthy();
  expect((await reset.json()).seed).toBe(2048);
});
