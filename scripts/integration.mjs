import assert from 'node:assert/strict';
const origin=process.env.SHELL_ORIGIN??'http://127.0.0.1:3000';
const api=process.env.API_ORIGIN??'http://127.0.0.1:4000';
let checks=0;
async function check(name,fn){await fn();checks++;console.log(`OK ${checks}: ${name}`);}
async function page(path){const r=await fetch(origin+path);assert.equal(r.status,200);return r.text();}
const valid={name:'Ana Demo',document:'123456789',email:'ana@example.com',recaptcha:'OK',productId:'metas'};
await check('API NestJS saludable',async()=>{const r=await fetch(api+'/v1/health');assert.equal((await r.json()).service,'brote-nest-api');});
await check('catálogo servido por NestJS',async()=>{const r=await fetch(api+'/v1/products');const p=await r.json();assert.equal(p.length,3);assert.ok(p.find(p=>p.id==='metas'));});
await check('producto inexistente devuelve 404',async()=>assert.equal((await fetch(api+'/v1/products/missing')).status,404));
await check('catálogo SSR/ISR conserva el hero',async()=>{const html=await page('/products');assert.ok(html.includes('Todo lo que sueñas'));assert.ok(html.includes('Ahorro Libre'));});
for(const [zone,prefix] of [['simulator','simulator-static'],['onboarding','onboarding-static']]){
 await check(`${zone}: ruta y bundle independientes`,async()=>{const html=await page(`/${zone}?product=metas`);assert.ok(html.includes('Ahorro con Metas'));const scripts=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);const asset=scripts.find(s=>s.startsWith('/'+prefix+'/'));assert.ok(asset,`No se encontró bundle ${prefix}`);assert.equal((await fetch(origin+asset)).status,200);});
 await check(`${zone}: producto inválido devuelve 404`,async()=>assert.equal((await fetch(`${origin}/${zone}?product=missing`)).status,404));
}
for(const endpoint of [api+'/v1/onboarding',origin+'/api/onboarding']){
 await check(`${endpoint}: rechaza token inválido`,async()=>{const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...valid,recaptcha:'NO'})});assert.equal(r.status,400);assert.ok((await r.json()).errors.recaptcha);});
 await check(`${endpoint}: valida tipos y campos`,async()=>{const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:[],document:123,email:null,recaptcha:'OK'})});assert.equal(r.status,400);});
 await check(`${endpoint}: UUID y producto conservado`,async()=>{const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(valid)});assert.equal(r.status,201);const data=await r.json();assert.match(data.code,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);assert.equal(data.productId,'metas');});
}
console.log(`\n${checks} comprobaciones de integración aprobadas.`);
