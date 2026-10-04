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

test('operations pages expose ranking and session evidence', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'See every run clearly.' })).toBeVisible();
  await page.goto('/leaderboard');
  await expect(page.getByRole('heading', { name: 'Who can handle the web?' })).toBeVisible();
  await expect(page.getByText('Axiom 3.2').first()).toBeVisible();
});

test('world state can be mutated and read back', async ({ request }) => {
  const update = await request.patch('/api/worlds/northwind/state', { data: { state: { payeeAdded: true, amount: 240 } } });
  expect(update.ok()).toBeTruthy();
  expect((await update.json()).state.amount).toBe(240);
  const read = await request.get('/api/worlds/northwind/state');
  expect(read.ok()).toBeTruthy();
  expect((await read.json()).state.payeeAdded).toBeTruthy();
});

test('ShopStack has a browsable checkout path', async ({ page }) => {
  await page.goto('/worlds/shopstack/products');
  await expect(page.getByRole('heading', { name: 'Tools for careful work.' })).toBeVisible();
  await page.getByRole('link', { name: 'Field Notes Kit', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Field Notes Kit' })).toBeVisible();
  await page.getByRole('button', { name: /Add to cart/ }).click();
  await page.getByRole('link', { name: /View cart/ }).click();
  await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
});

test('world actions are recorded as auditable evidence', async ({ request }) => {
  const created = await request.post('/api/worlds/shopstack/actions', { data: { type: 'order.placed', payload: { orderId: 'SS-E2E', total: 30 } } });
  expect(created.status()).toBe(201);
  const action = await created.json();
  expect(action.action.type).toBe('order.placed');
  const history = await request.get('/api/worlds/shopstack/actions');
  expect(history.ok()).toBeTruthy();
  expect((await history.json()).actions.some((item: { id: string }) => item.id === action.action.id)).toBeTruthy();
});

test('core worlds accept typed domain actions', async ({ request }) => {
  for (const [world, type] of [['northwind', 'transfer.created'], ['caredesk', 'ticket.created'], ['helix', 'expense.submitted'], ['civic', 'declaration.accepted']] as const) {
    const response = await request.post(`/api/worlds/${world}/actions`, { data: { type, payload: { source: 'e2e' } } });
    expect(response.status(), `${world} should accept ${type}`).toBe(201);
  }
});
