CREATE TABLE IF NOT EXISTS "agents" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "version" text NOT NULL,
  "vendor" text,
  "model" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS "benchmark_runs" (
  "id" text PRIMARY KEY NOT NULL,
  "session_token_hash" text NOT NULL,
  "user_id" text,
  "agent_id" text,
  "task_id" text NOT NULL,
  "world_id" text NOT NULL,
  "status" text DEFAULT 'running' NOT NULL,
  "started_at" timestamptz DEFAULT now() NOT NULL,
  "ended_at" timestamptz,
  "duration_ms" integer,
  "actions_per_minute" real,
  "score" real,
  "outcome" text,
  "verifier_version" text,
  "anti_cheat_flags" jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT "benchmark_runs_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "agents"("id")
);
CREATE TABLE IF NOT EXISTS "run_events" (
  "id" text PRIMARY KEY NOT NULL,
  "run_id" text NOT NULL,
  "type" text NOT NULL,
  "target" text,
  "path" text,
  "value_redacted" text,
  "metadata" jsonb DEFAULT '{}'::jsonb,
  "occurred_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "run_events_run_id_benchmark_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "benchmark_runs"("id")
);
CREATE TABLE IF NOT EXISTS "task_verifications" (
  "id" text PRIMARY KEY NOT NULL,
  "run_id" text NOT NULL,
  "verifier_version" text NOT NULL,
  "correctness" real NOT NULL,
  "efficiency" real NOT NULL,
  "speed" real NOT NULL,
  "recovery" real NOT NULL,
  "safety" real NOT NULL,
  "passed" boolean NOT NULL,
  "evidence" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "task_verifications_run_id_benchmark_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "benchmark_runs"("id")
);
CREATE INDEX IF NOT EXISTS "benchmark_runs_user_idx" ON "benchmark_runs" ("user_id");
CREATE INDEX IF NOT EXISTS "benchmark_runs_task_idx" ON "benchmark_runs" ("task_id");

CREATE TABLE IF NOT EXISTS "world_snapshots" (
  "world_id" text PRIMARY KEY,
  "seed" integer NOT NULL DEFAULT 2048,
  "state" jsonb NOT NULL DEFAULT '{}',
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "benchmark_runs_started_idx" ON "benchmark_runs" ("started_at");
