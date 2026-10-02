# Gauntlet

Gauntlet is a benchmark website for evaluating browser and computer-use agents. The current release includes a polished marketing surface with seeded demo data, responsive interaction states, evidence-led replay UI, category/use-case switching, filters, pricing toggle, and FAQ accordions.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```

## Product notes

- Demo metrics and leaderboard entries are explicitly labelled as seeded demo data.
- The visual system uses Bricolage Grotesque for display type and DM Sans for UI/data.
- `prefers-reduced-motion` is respected and a slim scrollbar is used throughout.
- The UI is ready to connect to a server-side task verifier and SQLite/Postgres event pipeline via the environment template.

## Production identity setup

Gauntlet needs both services:

1. Create a Clerk application. Configure sign-in methods, MFA policy, allowed origins, redirect URLs, and the production instance. Copy the publishable and secret keys into the environment.
2. Create a Neon Postgres project. Use the pooled connection for application traffic and the direct connection for migrations. Set `DATABASE_URL` and `DATABASE_URL_UNPOOLED`.
3. Set `NEXT_PUBLIC_APP_URL` to the exact trusted origin.
4. Run `npm run db:migrate` against the direct Neon connection.
5. Deploy only after `/api/readiness` returns HTTP 200 and `/production-readiness` has no blocked controls.

Until then, the app remains in demo mode. Demo mode uses an in-memory run store and simulated verification; it must not receive real identity, payment, or production credentials.

## Suggested next implementation slice

The remaining production work is task-specific verifier code and an isolated browser/VM runner. The schema and auth/database boundary are now in place for those additions: session tokens, world/category filters, replay timelines, step budgets, and safety-aware outcomes.
