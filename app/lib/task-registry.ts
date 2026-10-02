export type TaskDefinition = { id: string; world: string; title: string; category: string; difficulty: 1|2|3|4|5; optimalSteps: number; timeLimitSeconds: number; required: string[] };

export const taskRegistry: TaskDefinition[] = [
  { id:'FORM-01', world:'northwind', title:'Create an account', category:'Auth', difficulty:2, optimalSteps:7, timeLimitSeconds:180, required:['email','password','terms'] },
  { id:'FORM-04', world:'helix', title:'Apply for a role', category:'Forms', difficulty:3, optimalSteps:8, timeLimitSeconds:300, required:['resume','portfolio','coverNote'] },
  { id:'FORM-07', world:'helix', title:'Submit an expense report', category:'Data entry', difficulty:4, optimalSteps:12, timeLimitSeconds:360, required:['rows','receipt'] },
  { id:'FORM-10', world:'wanderly', title:'Search for a flight', category:'Navigation', difficulty:3, optimalSteps:8, timeLimitSeconds:240, required:['from','to','depart','cabin','passengers'] },
  { id:'FORM-14', world:'northwind', title:'Harden account security', category:'Auth', difficulty:4, optimalSteps:5, timeLimitSeconds:180, required:['toggle','otp','phrase'] },
  { id:'FORM-19', world:'caredesk', title:'Import a contacts file', category:'Data entry', difficulty:4, optimalSteps:6, timeLimitSeconds:300, required:['file','mapping'] },
  { id:'SS-06', world:'shopstack', title:'Checkout with a coupon', category:'Multi-step', difficulty:4, optimalSteps:14, timeLimitSeconds:420, required:['cart','coupon','address','humanCheckpoint'] },
  { id:'NW-07', world:'northwind', title:'Transfer money', category:'Multi-step', difficulty:5, optimalSteps:11, timeLimitSeconds:300, required:['payee','amount','confirmation'] },
  { id:'WA-09', world:'wanderly', title:'Select a seat and extras', category:'Forms', difficulty:4, optimalSteps:10, timeLimitSeconds:360, required:['flight','seat','extras'] },
  { id:'CP-04', world:'civic', title:'Complete required declarations', category:'Auth', difficulty:3, optimalSteps:6, timeLimitSeconds:300, required:['declaration','consent'] },
];

export function findTask(id: string) { return taskRegistry.find(task => task.id === id); }

export function verifyTask(taskId: string, state: Record<string, unknown>) {
  const task = findTask(taskId);
  if (!task) return { passed: false, correctness: 0, evidence: { error: 'Unknown task' } };
  const missing = task.required.filter(key => {
    const value = state[key];
    return value === undefined || value === null || value === '' || value === false || (Array.isArray(value) && value.length === 0);
  });
  const correctness = Math.max(0, (task.required.length - missing.length) / task.required.length);
  return { passed: missing.length === 0, correctness, evidence: { taskId, required: task.required, missing } };
}

export const seededWorlds = ['northwind','wanderly','helix','shopstack','caredesk','civic'] as const;
