import Link from 'next/link';
import { Check, LockKeyhole, Server, ShieldAlert } from 'lucide-react';
import { readiness } from '../lib/readiness';

export default function ProductionReadiness() {
  const status = readiness();
  const items = [
    ['Clerk identity', status.clerk, 'Secure sign-in, MFA, sessions, and organization identity'],
    ['Neon database', status.neon, 'Durable runs, events, scores, audit trails, and task state'],
    ['Application origin', status.app, 'Trusted URL for callbacks, cookies, and browser approvals'],
    ['Task verifiers', false, 'Every production task must verify saved state server-side'],
    ['Browser isolation', false, 'Disposable browser/VM with allowlisted origins and action limits'],
    ['Security review', false, 'Rate limits, CSRF/origin checks, redaction, audit export, and incident plan'],
  ] as const;
  const passed = items.filter(x=>x[1]).length;
  return <main className="readiness-page"><nav className="nav"><div className="wrap nav-inner"><Link className="brand" href="/"><span className="brand-mark">⌁</span>gauntlet</Link><div className="nav-links"><Link href="/docs">Docs</Link><Link href="/dashboard">Dashboard</Link><Link href="/benchmark">Benchmark</Link></div><Link className="button dark" href="/">Back to site</Link></div></nav><div className="wrap readiness-wrap"><div className="eyebrow"><i/> Production gate</div><h1 className="portal-title">Do not send real identity data yet.</h1><p className="lead">This checklist makes the boundary explicit. Demo mode remains safe for seeded browser tasks; production mode stays blocked until the full control plane is configured.</p><div className="readiness-status"><div className="readiness-icon"><ShieldAlert size={24}/></div><div><span className="status warning">{status.productionReady?'ready for configured checks':'demo mode only'}</span><h2>{passed} of {items.length} controls configured</h2><p>{status.productionReady?'Infrastructure variables are present. Complete the verifier, isolation, and security checks before launch.':'Add Clerk, Neon, and the app origin before any real identity workflow is enabled.'}</p></div></div><div className="readiness-grid">{items.map(([name,ok,detail])=><article className={ok?'ready-card':'blocked-card'} key={name}><div className="readiness-card-top"><span className="readiness-check">{ok?<Check size={15}/>:<LockKeyhole size={15}/>}</span><b>{name}</b><span className="readiness-state">{ok?'configured':'blocked'}</span></div><p>{detail}</p></article>)}</div><div className="next-actions"><div><h3>What to do right now</h3><p>1. Create a Clerk application and enable the identity methods you want. 2. Create a Neon project and run the migration. 3. Add the environment variables from <code>.env.example</code>. 4. Keep real identity tests in a separate Clerk/Neon project from production data.</p></div><Link className="button lime" href="/docs">Open setup docs</Link></div><div className="readiness-foot"><Server size={15}/> Readiness API: <code>/api/readiness</code> · HTTP 503 until infrastructure is configured.</div></div></main>;
}
