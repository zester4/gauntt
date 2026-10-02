'use client';
import { useEffect } from 'react';
import { sendBenchmarkEvent, startBenchmarkRun } from '../lib/benchmark';

export default function RunTracker() {
  useEffect(() => {
    const path = window.location.pathname;
    const shouldTrack = path.startsWith('/worlds/') || path === '/tasks';
    if (!shouldTrack) return;
    let runId = sessionStorage.getItem('gauntlet-run-id');
    const startedAt = Number(sessionStorage.getItem('gauntlet-run-started-at') || Date.now());
    if (!runId) {
      startBenchmarkRun({ agent: 'Browser session', task: path === '/tasks' ? 'FORM-LAB' : path.split('/').filter(Boolean).pop(), world: path.startsWith('/worlds/') ? path.split('/')[2] : 'forms' }).then(run => {
        runId = run.runId;
        sessionStorage.setItem('gauntlet-run-id', runId);
        sessionStorage.setItem('gauntlet-run-started-at', String(startedAt));
        sendBenchmarkEvent(runId, { type: 'page_view', path });
      }).catch(() => undefined);
    }
    const selector = (element: Element) => element.id ? `#${element.id}` : element.getAttribute('aria-label') ? `[aria-label="${element.getAttribute('aria-label')}"]` : element.tagName.toLowerCase();
    const send = (event: Parameters<typeof sendBenchmarkEvent>[1]) => { if (runId) sendBenchmarkEvent(runId, { ...event, metadata: { ...(event.metadata || {}), elapsedMs: Date.now() - startedAt } }).catch(() => undefined); };
    const onClick = (event: MouseEvent) => { const target = event.target as Element | null; if (target) send({ type: 'click', target: selector(target.closest('button,a,input,select,textarea') || target), path }); };
    const onInput = (event: Event) => { const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null; if (target) send({ type: 'input', target: selector(target), value: target.type === 'password' ? '[redacted]' : target.value?.slice(0, 120), path }); };
    const onFocus = (event: FocusEvent) => { const target = event.target as Element | null; if (target) send({ type: 'focus', target: selector(target), path }); };
    const onScroll = () => send({ type: 'scroll', path, metadata: { y: Math.round(window.scrollY) } });
    document.addEventListener('click', onClick, true); document.addEventListener('input', onInput, true); document.addEventListener('focusin', onFocus, true); window.addEventListener('scroll', onScroll, { passive: true });
    return () => { document.removeEventListener('click', onClick, true); document.removeEventListener('input', onInput, true); document.removeEventListener('focusin', onFocus, true); window.removeEventListener('scroll', onScroll); };
  }, []);
  return null;
}
