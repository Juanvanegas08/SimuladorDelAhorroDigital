import {command,completed,ready,stop} from './processes.mjs';
let api;
try{
 await completed(command(['run','build','--workspace','@brote/contracts']));
 await completed(command(['run','build','--workspace','@brote/api']));
 const origin=process.env.API_ORIGIN??'http://127.0.0.1:4000';
 let active=false;
 try{const response=await fetch(`${origin}/v1/health`,{signal:AbortSignal.timeout(1500)});active=response.ok&&(await response.json()).service==='brote-nest-api';}catch{}
 if(!active){api=command(['run','start','--workspace','@brote/api']);await ready(`${origin}/v1/health`);}
 for(const workspace of ['@brote/simulator','@brote/onboarding'])await completed(command(['run','build','--workspace',workspace]));
 await completed(command(['run','build:shell']));
 console.log('Compilados: API NestJS, contratos y tres microfrontends.');
}catch(error){console.error(error);process.exitCode=1;}finally{stop(api);}
