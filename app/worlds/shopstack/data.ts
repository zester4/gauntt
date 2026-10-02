export const products = [
  { id:'field-notes', name:'Field Notes Kit', category:'Desk tools', price:24, oldPrice:29, color:'#dfeade', description:'A compact set of analog tools for careful digital work.', tags:['Bestseller','In stock'] },
  { id:'signal-lamp', name:'Signal Desk Lamp', category:'Workspace', price:68, oldPrice:79, color:'#e5e9ed', description:'Warm, adjustable light for long evaluation sessions.', tags:['New','In stock'] },
  { id:'quiet-keys', name:'Quiet Keys 84', category:'Hardware', price:112, oldPrice:129, color:'#e9e1d9', description:'A low-profile mechanical keyboard with a softer landing.', tags:['Low stock','In stock'] },
  { id:'carry-case', name:'Carry Case 02', category:'Travel', price:42, oldPrice:48, color:'#dce8e8', description:'A structured case for the tools that go where your agent goes.', tags:['In stock'] },
];
export type Product = typeof products[number];
