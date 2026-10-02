import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';
export default function SignUpPage() {
  const ready = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  return <main className="auth-page"><div className="auth-card"><Link className="brand" href="/"><span className="brand-mark">⌁</span>gauntlet</Link>{ready ? <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" /> : <div className="auth-setup"><span className="status">Identity not configured</span><h1>Clerk is required before sign-up.</h1><p>Add the Clerk publishable and secret keys to the environment, then reload this page.</p><Link href="/production-readiness" className="button dark">View readiness checklist</Link></div>}</div></main>;
}
