export function readiness() {
  const clerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
  const neon = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL_UNPOOLED);
  const app = Boolean(process.env.NEXT_PUBLIC_APP_URL);
  return { clerk, neon, app, productionReady: clerk && neon && app, demoMode: !clerk || !neon };
}
