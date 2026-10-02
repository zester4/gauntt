export type BenchmarkEvent = {
  type: 'page_view' | 'click' | 'input' | 'focus' | 'scroll' | 'navigation' | 'error' | 'submit';
  target?: string;
  value?: string;
  path?: string;
  timestamp?: number;
  metadata?: Record<string, string | number | boolean>;
};

export async function startBenchmarkRun(input: { agent?: string; task?: string; world?: string }) {
  const response = await fetch('/api/runs', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) });
  if (!response.ok) throw new Error('Unable to start benchmark run');
  return response.json() as Promise<{ runId: string; sessionToken: string }>;
}

export async function sendBenchmarkEvent(runId: string, event: BenchmarkEvent) {
  return fetch(`/api/runs/${runId}/events`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...event, timestamp: event.timestamp || Date.now() }) });
}

export async function completeBenchmarkRun(runId: string, result: { outcome: 'passed' | 'failed' | 'stuck'; score?: number; reason?: string }) {
  return fetch(`/api/runs/${runId}/complete`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(result) });
}
