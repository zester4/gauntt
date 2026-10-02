import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ seeded: true, updatedAt: new Date().toISOString(), agents: [
    { name:'Axiom 3.2', score:94.8, delta:2.4, successRate:96, medianSteps:18, trend:[88,89,90,91,93,94.8] },
    { name:'Navigator Pro', score:91.6, delta:-1.1, successRate:93, medianSteps:24, trend:[92,93,94,93,92,91.6] },
    { name:'BrowserPilot 1.8', score:87.2, delta:3.7, successRate:89, medianSteps:31, trend:[79,81,82,84,85,87.2] },
    { name:'OpenHands R4', score:82.5, delta:-3.2, successRate:84, medianSteps:38, trend:[87,86,85,84,83,82.5] },
  ] });
}
