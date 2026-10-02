# Benchmark tracking design

Gauntlet uses the same basic loop exposed by modern computer-use systems: the agent observes the current browser state, proposes one or more actions, the harness executes them, and the harness returns the next observation. A run must keep the browser session and event history alive across turns.

## What Gauntlet records

Each run receives a `runId` and `sessionToken`. The browser tracker records:

- page views and navigation paths
- clicks and the best available semantic selector
- focus changes
- inputs, with password values redacted
- scroll position
- submit and error events
- received timestamps and event count
- elapsed milliseconds from run start on every event
- duration to verified completion
- action pace (`actionsPerMinute`) for comparing fast and slow agents

The run explorer at `/dashboard/runs` turns those events into a step timeline. The compare view at `/dashboard/compare` shows rank, score delta, success rate, median steps, trend bars, and regressions to inspect.

## API surface

```text
POST /api/runs
POST /api/runs/:runId/events
POST /api/runs/:runId/complete
GET  /api/runs
GET  /api/runs/:runId
GET  /api/leaderboard
```

`/api/runs/:runId/complete` accepts `passed`, `failed`, or `stuck`, plus a score and reason. It returns `durationMs`, `durationSeconds`, and `actionsPerMinute`. In production this endpoint should call task-specific verifiers against a database snapshot; the current release uses an in-memory demo store so the dashboard is immediately runnable.

## Integration notes from current agent runtimes

- OpenAI computer-use integrations expose structured actions such as click, double click, drag, move, scroll, keypress, type, wait, and screenshot. The app must execute those actions, return observations, keep the environment alive, and verify the actual outcome rather than trusting a final model message.
- OpenAI hosted browser sessions expose streamed computer-use activity and saved session history. Preserve the session ID, surface origin approvals, and keep screenshots optional but available for replay.
- Anthropic computer use emits one or more ordered `tool_use` blocks. Dispatch every block in order, return one matched `tool_result` per block, and stop on the first failed action in a dependent batch.
- Browser automation runtimes commonly expose navigation, tab, focus, download, error, screenshot, DOM, and event-bus signals. Those should map to first-class trace events rather than being flattened into a single “step”.

## Production extension

Replace the in-memory map with SQLite/Postgres tables for `runs`, `events`, `task_attempts`, `scores`, `agent_versions`, and `world_snapshots`. Add a verifier registry keyed by task ID, store screenshots or DOM snapshots by event ID, and compute aggregate confidence intervals only when multiple independent runs exist.
