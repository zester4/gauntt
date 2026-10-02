# Production setup gate

## Use both Clerk and Neon

Clerk is the identity layer. It owns sign-up, sign-in, MFA, sessions, organizations, and identity-provider configuration.

Neon is the benchmark data layer. It stores agents, runs, event traces, task verification evidence, scores, timing, anti-cheat flags, and world snapshots.

They solve different problems and should be connected by the authenticated Clerk `userId` stored on each benchmark run.

## Safe order of operations

1. Create separate Clerk and Neon projects for local/staging and production.
2. Configure Clerk redirect URLs and allowed origins for the exact app URL.
3. Add the environment values from `.env.example` to the deployment secret store.
4. Run `npm run db:migrate` using `DATABASE_URL_UNPOOLED`.
5. Confirm `GET /api/readiness` returns `{ "productionReady": true }`.
6. Complete a seeded task with a test Clerk account.
7. Confirm the run is persisted in Neon and the trace can be replayed.
8. Add real identity flows only after the isolated browser runner, verifier, redaction, rate limit, and audit controls are enabled.

## Current guardrails

- No Clerk keys means no Clerk middleware enforcement and the app labels itself demo mode.
- No Neon URLs means no durable production store and readiness returns HTTP 503.
- Verification is explicitly simulated until a real identity or CAPTCHA provider is configured.
- The current API keeps an in-memory fallback so seeded UI development remains possible, but that fallback is not a production datastore.
