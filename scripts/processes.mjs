import {spawn,spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const npm=process.env.npm_execpath;
export function command(args,options={}){
 if(!npm)throw new Error('Ejecuta este script con npm run.');
 return spawn(process.execPath,[npm,...args],{cwd:root,stdio:'inherit',windowsHide:true,...options});
}
export function completed(child){return new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',code=>code===0?resolve():reject(new Error(`Un comando terminó con código ${code}.`)));});}
export async function ready(url,timeout=60000){const until=Date.now()+timeout;while(Date.now()<until){try{const r=await fetch(url,{signal:AbortSignal.timeout(1500)});if(r.ok)return;}catch{}await new Promise(r=>setTimeout(r,300));}throw new Error(`El servicio no inició: ${url}`);}
export function stop(child){if(!child||child.exitCode!==null)return;if(process.platform==='win32')spawnSync('taskkill',['/PID',String(child.pid),'/T','/F'],{stdio:'ignore',windowsHide:true});else child.kill('SIGTERM');}
