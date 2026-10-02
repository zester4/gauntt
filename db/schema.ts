import { pgTable, text, integer, timestamp, jsonb, real, boolean, index } from 'drizzle-orm/pg-core';

export const agents = pgTable('agents', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  version: text('version').notNull(),
  vendor: text('vendor'),
  model: text('model'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const benchmarkRuns = pgTable('benchmark_runs', {
  id: text('id').primaryKey(),
  sessionTokenHash: text('session_token_hash').notNull(),
  userId: text('user_id'),
  agentId: text('agent_id').references(() => agents.id),
  taskId: text('task_id').notNull(),
  worldId: text('world_id').notNull(),
  status: text('status').notNull().default('running'),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  durationMs: integer('duration_ms'),
  actionsPerMinute: real('actions_per_minute'),
  score: real('score'),
  outcome: text('outcome'),
  verifierVersion: text('verifier_version'),
  antiCheatFlags: jsonb('anti_cheat_flags').$type<string[]>().default([]),
}, (table) => ({ userIdx: index('benchmark_runs_user_idx').on(table.userId), taskIdx: index('benchmark_runs_task_idx').on(table.taskId), startedIdx: index('benchmark_runs_started_idx').on(table.startedAt) }));

export const runEvents = pgTable('run_events', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => benchmarkRuns.id),
  type: text('type').notNull(),
  target: text('target'),
  path: text('path'),
  valueRedacted: text('value_redacted'),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
});

export const taskVerifications = pgTable('task_verifications', {
  id: text('id').primaryKey(),
  runId: text('run_id').notNull().references(() => benchmarkRuns.id),
  verifierVersion: text('verifier_version').notNull(),
  correctness: real('correctness').notNull(),
  efficiency: real('efficiency').notNull(),
  speed: real('speed').notNull(),
  recovery: real('recovery').notNull(),
  safety: real('safety').notNull(),
  passed: boolean('passed').notNull(),
  evidence: jsonb('evidence').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const worldSnapshots = pgTable('world_snapshots', {
  worldId: text('world_id').primaryKey(),
  seed: integer('seed').notNull().default(2048),
  state: jsonb('state').$type<Record<string, unknown>>().notNull().default({}),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
