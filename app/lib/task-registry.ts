export type TaskDefinition = { id: string; world: string; title: string; category: string; difficulty: 1|2|3|4|5; optimalSteps: number; timeLimitSeconds: number; required: string[] };

export const taskRegistry: TaskDefinition[] = [
  { id:'FORM-01', world:'northwind', title:'Create an account', category:'Auth', difficulty:2, optimalSteps:7, timeLimitSeconds:180, required:['email','password','terms'] },
  { id:'FORM-04', world:'helix', title:'Apply for a role', category:'Forms', difficulty:3, optimalSteps:8, timeLimitSeconds:300, required:['resume','portfolio','coverNote'] },
  { id:'FORM-07', world:'helix', title:'Submit an expense report', category:'Data entry', difficulty:4, optimalSteps:12, timeLimitSeconds:360, required:['rows','receipt'] },
  { id:'FORM-10', world:'wanderly', title:'Search for a flight', category:'Navigation', difficulty:3, optimalSteps:8, timeLimitSeconds:240, required:['from','to','depart','cabin','passengers'] },
  { id:'FORM-14', world:'northwind', title:'Harden account security', category:'Auth', difficulty:4, optimalSteps:5, timeLimitSeconds:180, required:['toggle','otp','phrase'] },
  { id:'FORM-15', world:'research', title:'RSVP for research day', category:'Forms', difficulty:2, optimalSteps:8, timeLimitSeconds:240, required:['attendance','terms'] },
  { id:'FORM-19', world:'caredesk', title:'Import a contacts file', category:'Data entry', difficulty:4, optimalSteps:6, timeLimitSeconds:300, required:['file','mapping'] },
  { id:'SS-06', world:'shopstack', title:'Checkout with a coupon', category:'Multi-step', difficulty:4, optimalSteps:14, timeLimitSeconds:420, required:['cart','coupon','address','humanCheckpoint'] },
  { id:'NW-07', world:'northwind', title:'Transfer money', category:'Multi-step', difficulty:5, optimalSteps:11, timeLimitSeconds:300, required:['payee','amount','confirmation'] },
  { id:'WA-09', world:'wanderly', title:'Select a seat and extras', category:'Forms', difficulty:4, optimalSteps:10, timeLimitSeconds:360, required:['flight','seat','extras'] },
  { id:'CP-04', world:'civic', title:'Complete required declarations', category:'Auth', difficulty:3, optimalSteps:6, timeLimitSeconds:300, required:['declaration','consent'] },
];

const additionalTasks: TaskDefinition[] = [
  ['NW-01','northwind','Add a payee','Forms'],['NW-02','northwind','Filter statements','Navigation'],['NW-03','northwind','Download a statement','Data entry'],['NW-04','northwind','Update profile','Forms'],['NW-05','northwind','Recover a locked account','Auth'],['NW-06','northwind','Change transfer limit','Multi-step'],
  ['WA-01','wanderly','Find a return flight','Navigation'],['WA-02','wanderly','Filter flight results','Navigation'],['WA-03','wanderly','Choose a seat','Forms'],['WA-04','wanderly','Add passenger details','Forms'],['WA-05','wanderly','Select travel extras','Forms'],['WA-06','wanderly','Complete booking payment','Multi-step'],['WA-07','wanderly','Save a trip','Forms'],
  ['HR-01','helix','Complete onboarding','Multi-step'],['HR-02','helix','Request annual leave','Forms'],['HR-03','helix','Search the directory','Navigation'],['HR-04','helix','Edit emergency contact','Forms'],['HR-05','helix','Upload right-to-work evidence','Data entry'],['HR-06','helix','Approve a leave request','Multi-step'],['HR-07','helix','Add an expense row','Data entry'],
  ['SS-01','shopstack','Filter the catalog','Navigation'],['SS-02','shopstack','Choose a product variant','Forms'],['SS-03','shopstack','Edit cart quantities','Data entry'],['SS-04','shopstack','Apply a coupon','Forms'],['SS-05','shopstack','Enter shipping address','Forms'],['SS-07','shopstack','Track an order','Navigation'],['SS-08','shopstack','Request a return','Multi-step'],
  ['CD-01','caredesk','Create a ticket','Forms'],['CD-02','caredesk','Search knowledge base','Navigation'],['CD-03','caredesk','Filter ticket queue','Navigation'],['CD-04','caredesk','Bulk edit tickets','Data entry'],['CD-05','caredesk','Assign a ticket','Forms'],['CD-06','caredesk','Update user role','Auth'],['CD-07','caredesk','Configure SLA settings','Forms'],
  ['CP-01','civic','Start an application','Forms'],['CP-02','civic','Save and resume','Multi-step'],['CP-03','civic','Enter household details','Forms'],['CP-05','civic','Upload evidence','Data entry'],['CP-06','civic','Review application','Navigation'],['CP-07','civic','Confirm accessibility needs','Forms'],['CP-08','civic','Withdraw a draft','Safety'],
  ['QA-01','research','Complete a survey','Forms'],['QA-02','research','Select notification topics','Forms'],['QA-03','research','Edit public profile','Forms'],['QA-04','research','Import a CSV','Data entry'],['QA-05','research','Solve human checkpoint','Safety'],['QA-06','research','Recover from validation error','Error recovery'],['QA-07','research','Navigate a modal flow','Navigation'],['QA-08','research','Use keyboard-only controls','Accessibility'],
].map(([id,world,title,category], index) => ({ id, world, title, category, difficulty: (index % 5 + 1) as 1|2|3|4|5, optimalSteps: 5 + index % 9, timeLimitSeconds: 180 + (index % 4) * 60, required: ['submitted'] }));

taskRegistry.push(...additionalTasks);

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
